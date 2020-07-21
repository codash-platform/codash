import moment from 'moment'
import {DATE_FORMAT_APP, DATE_FORMAT_ECDC, GRAPH_SCALE, METRIC} from './constants'
import {
  AccumulatedDataEntry,
  BarData,
  BarEntryData,
  Data,
  DataEntry,
  DateFilter,
  GraphData,
  InitialDataEntry,
  LineData,
  LineGraphData,
  LineParsedData,
  TableDataEntry,
  RatesDataEntry,
  RawData,
} from './typeUtils'

export const parseRawData = (rawData: Array<RawData>): Data => {
  const initialPerDateData: Record<string, InitialDataEntry[]> = {}
  const ratesPerDateData: Record<string, RatesDataEntry[]> = {}
  const globalPerDay: Record<string, InitialDataEntry> = {}
  const datesAvailable = new Set<string>()
  const geoIds = new Set<string>()
  const geoIdToNameMapping: Record<string, string> = {}

  if (!rawData[0]?.dateRep) {
    return null
  }

  rawData.map(record => {
    const cases = parseInt(record.cases)
    const deaths = parseInt(record.deaths)
    const population = parseInt(record.popData2019) || parseInt(record.popData2018) || getMissingPopulation(record)
    const name = record.countriesAndTerritories.split('_').join(' ')
    const dateKey = moment(record.dateRep, DATE_FORMAT_ECDC).format(DATE_FORMAT_APP)

    datesAvailable.add(dateKey)
    geoIds.add(record.geoId)
    geoIdToNameMapping[record.geoId] = name

    if (!initialPerDateData[dateKey]) {
      initialPerDateData[dateKey] = []
    }

    initialPerDateData[dateKey].push({
      name: name,
      [METRIC.CASES_NEW]: cases,
      [METRIC.DEATHS_NEW]: deaths,
      geoId: record.geoId,
      population: population,
    })

    if (!globalPerDay[dateKey]) {
      globalPerDay[dateKey] = createInitialEntryPerCountry('Combined Data', 'WW', 0)
      geoIdToNameMapping.WW = 'Combined Data'
    }

    globalPerDay[dateKey][METRIC.CASES_NEW] += cases
    globalPerDay[dateKey][METRIC.DEATHS_NEW] += deaths
    globalPerDay[dateKey].population += population
  })
  for (const dateKey of Object.keys(initialPerDateData)) {
    initialPerDateData[dateKey].push(globalPerDay[dateKey])
    ratesPerDateData[dateKey] = calculateRatesData(initialPerDateData[dateKey])
  }
  const sortedDates = getSortedDates(datesAvailable)
  const perDateData = calculateAccumulatedData(ratesPerDateData, sortedDates)

  return {
    rawData: rawData,
    startDate: sortedDates[0] ?? null,
    endDate: sortedDates[sortedDates.length - 1] ?? null,
    datesAvailable: sortedDates,
    geoIds: [...geoIds].sort(),
    geoIdToNameMapping: geoIdToNameMapping,
    perDateData: perDateData,
  }
}

const getSortedDates = (datesSet: Set<string>): string[] => {
  return [...datesSet].sort((a, b) => moment(a, DATE_FORMAT_APP).unix() - moment(b, DATE_FORMAT_APP).unix())
}

const calculateRatesData = <T extends InitialDataEntry, U extends RatesDataEntry>(data: T[]): U[] => {
  const result: RatesDataEntry[] = data.map(element => ({
    ...element,
    [METRIC.CASES_PER_CAPITA]: calculateRate(element[METRIC.CASES_NEW], element.population, 1000000),
    [METRIC.DEATHS_PER_CAPITA]: calculateRate(element[METRIC.DEATHS_NEW], element.population, 1000000),
    [METRIC.MORTALITY_PERCENTAGE]: calculateRate(element[METRIC.DEATHS_NEW], element[METRIC.CASES_NEW], 100),
  }))

  return result as U[]
}

const calculateAccumulatedData = (
  perDateData: Record<string, InitialDataEntry[]>,
  sortedDates: string[]
): Record<string, DataEntry[]> => {
  const perGeoIdAccumulatedData: Record<string, Partial<AccumulatedDataEntry>> = {}

  for (const dateKey of sortedDates) {
    perDateData[dateKey].forEach(entry => {
      if (!perGeoIdAccumulatedData[entry.geoId]) {
        perGeoIdAccumulatedData[entry.geoId] = {
          [METRIC.CASES_ACCUMULATED]: 0,
          [METRIC.DEATHS_ACCUMULATED]: 0,
        }
      }

      perGeoIdAccumulatedData[entry.geoId][METRIC.CASES_ACCUMULATED] += entry[METRIC.CASES_NEW]
      perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED] += entry[METRIC.DEATHS_NEW]

      entry[METRIC.CASES_ACCUMULATED] = perGeoIdAccumulatedData[entry.geoId][METRIC.CASES_ACCUMULATED]
      entry[METRIC.DEATHS_ACCUMULATED] = perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED]

      entry[METRIC.CASES_PER_CAPITA_ACCUMULATED] = calculateRate(
        perGeoIdAccumulatedData[entry.geoId][METRIC.CASES_ACCUMULATED],
        entry.population,
        1000000
      )
      entry[METRIC.DEATHS_PER_CAPITA_ACCUMULATED] = calculateRate(
        perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED],
        entry.population,
        1000000
      )
      entry[METRIC.MORTALITY_PERCENTAGE_ACCUMULATED] = calculateRate(
        perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED],
        perGeoIdAccumulatedData[entry.geoId][METRIC.CASES_ACCUMULATED],
        100
      )
    })
  }

  return perDateData as Record<string, DataEntry[]>
}

const parseSectionData = (
  perDateData: Record<string, InitialDataEntry[]> = {},
  startDate: moment.Moment,
  endDate: moment.Moment
): DataEntry[] => {
  const perGeoIdData = {}

  for (const [dateKey, entriesForDate] of Object.entries(perDateData)) {
    if (startDate && moment(dateKey, DATE_FORMAT_APP).isBefore(startDate, 'day')) {
      continue
    }

    if (endDate && moment(dateKey, DATE_FORMAT_APP).isAfter(endDate, 'day')) {
      continue
    }

    for (const entry of entriesForDate) {
      if (!perGeoIdData[entry.geoId]) {
        perGeoIdData[entry.geoId] = createInitialEntryPerCountry(entry.name, entry.geoId, entry.population)
      }
      perGeoIdData[entry.geoId][METRIC.CASES_NEW] += entry[METRIC.CASES_NEW]
      perGeoIdData[entry.geoId][METRIC.DEATHS_NEW] += entry[METRIC.DEATHS_NEW]
    }
  }

  const endDateKey = endDate.format(DATE_FORMAT_APP)
  perDateData?.[endDateKey]?.map(entry => {
    if (!perGeoIdData[entry.geoId]) {
      perGeoIdData[entry.geoId] = createInitialEntryPerCountry(entry.name, entry.geoId, entry.population)
    }
    perGeoIdData[entry.geoId][METRIC.CASES_ACCUMULATED] = entry[METRIC.CASES_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.DEATHS_ACCUMULATED] = entry[METRIC.DEATHS_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.CASES_PER_CAPITA_ACCUMULATED] = entry[METRIC.CASES_PER_CAPITA_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.DEATHS_PER_CAPITA_ACCUMULATED] = entry[METRIC.DEATHS_PER_CAPITA_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.MORTALITY_PERCENTAGE_ACCUMULATED] = entry[METRIC.MORTALITY_PERCENTAGE_ACCUMULATED]
  })

  const resultData: InitialDataEntry[] = Object.values(perGeoIdData)

  return calculateRatesData(resultData)
}

const calculateRate = (cases: number, total: number, referenceRate: number): number => {
  if (total === 0) {
    return 0
  }

  return changePrecision(cases / (total / referenceRate), 2)
}

const changePrecision = (number: number, precision: number): number => {
  const factor = Math.pow(10, precision)
  const tempNumber = number * factor
  const roundedTempNumber = Math.round(tempNumber)

  return roundedTempNumber / factor
}

const createInitialEntryPerCountry = (name: string, geoId: string, population: number): InitialDataEntry => {
  return {
    [METRIC.CASES_NEW]: 0,
    [METRIC.DEATHS_NEW]: 0,
    name: name,
    geoId: geoId,
    population: population,
  }
}

// for some reason, the ECDC is missing the population count for these countries
const hardcodedPopulationData = {
  AI: 14731,
  BQ: 25711,
  CZ: 10665677,
  ER: 3452786,
  EH: 567402,
  FK: 3234,
  JPG11668: 3711, // Diamond Princess cruise ship
}

const getMissingPopulation = (element: RawData): number => {
  let population = null
  if (hardcodedPopulationData[element.geoId]) {
    population = hardcodedPopulationData[element.geoId]
  } else {
    console.warn('Missing population count for:', element.geoId, element.countriesAndTerritories)
  }

  return population
}

export const getTableData = (
  data: Data,
  dateFilter: DateFilter,
  selectedGeoIds: Record<string, string>,
  maxSelectionReached: boolean
): TableDataEntry[] => {
  const startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  const endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)

  const sectionData = parseSectionData(data?.perDateData, startDate, endDate)

  return addSelectionColumn(sectionData, selectedGeoIds, maxSelectionReached)
}

const addSelectionColumn = (
  tableData: DataEntry[],
  selectedGeoIds: Record<string, string>,
  maxSelectionReached: boolean
): TableDataEntry[] => {
  return tableData.map(entry => {
    return {
      ...entry,
      selected: !!selectedGeoIds[entry.geoId],
      maxSelectionReached: maxSelectionReached,
    }
  })
}

export const getGraphData = (
  data: Data,
  dateFilter: DateFilter,
  selectedGeoIds: Record<string, string>,
  propertyName: string,
  lineGraphVisible: boolean,
  barGraphVisible: boolean,
  graphScale: string
): GraphData => {
  const result: Partial<GraphData> = {}

  if (!data?.perDateData) {
    return result as GraphData
  }

  const startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  const endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)
  const cleanedData: Record<string, DataEntry[]> = {}

  for (const [dateKey, entriesForDate] of Object.entries(data.perDateData)) {
    const dateObj = moment(dateKey, DATE_FORMAT_APP)

    if (startDate.isValid() && dateObj.isBefore(startDate, 'day')) {
      continue
    }

    if (endDate.isValid() && dateObj.isAfter(endDate, 'day')) {
      continue
    }

    cleanedData[dateKey] = entriesForDate.filter(entry => !!selectedGeoIds[entry.geoId])
  }

  if (lineGraphVisible) {
    const {lineData, logarithmParams} = getLineGraphData(cleanedData, data.geoIdToNameMapping, propertyName, graphScale)
    result.lineData = lineData
    result.logarithmParams = logarithmParams
  }

  if (barGraphVisible) {
    result.barData = getBarGraphData(cleanedData, data.geoIdToNameMapping, selectedGeoIds, propertyName)
  }

  return result as GraphData
}

const getBarGraphData = (
  cleanedData: Record<string, DataEntry[]>,
  geoIdToNameMapping: Record<string, string>,
  selectedGeoIds: Record<string, string>,
  propertyName: string
): BarData => {
  const parsedData: BarEntryData[] = []

  for (const [dateKey, entriesForDate] of Object.entries(cleanedData)) {
    const newEntry = {date: dateKey, nameToGeoId: {}}
    entriesForDate.forEach(entry => {
      newEntry[geoIdToNameMapping[entry.geoId]] = entry[propertyName]
      newEntry.nameToGeoId[geoIdToNameMapping[entry.geoId]] = entry.geoId
    })
    parsedData.push(newEntry)
  }

  const geoIdList = Object.entries(selectedGeoIds)
    .filter(([key, value]) => value)
    .map(([key, value]) => key)
    .sort()

  const keys = geoIdList.map(geoId => geoIdToNameMapping[geoId])

  return {
    keys: keys,
    data: sortArrayByDateProperty(parsedData, 'date'),
  }
}

const getLineGraphData = (
  cleanedData: Record<string, DataEntry[]>,
  geoIdToNameMapping: Record<string, string>,
  propertyName: string,
  graphScale: string
): LineGraphData => {
  const result: LineData[] = []
  const parsedData: Record<string, LineParsedData[]> = {}
  const logarithmParams = {
    min: null,
    max: null,
  }

  for (const [dateKey, entriesForDate] of Object.entries(cleanedData)) {
    entriesForDate.map(entry => {
      if (!parsedData[entry.geoId]) {
        parsedData[entry.geoId] = []
      }
      const dateValue = entry[propertyName]

      if (graphScale === GRAPH_SCALE.LOGARITHMIC) {
        if (dateValue <= 0) {
          return
        }

        if (logarithmParams.min === null || dateValue < logarithmParams.min) {
          logarithmParams.min = dateValue
        }

        if (logarithmParams.max === null || dateValue > logarithmParams.max) {
          logarithmParams.max = dateValue
        }
      }

      parsedData[entry.geoId].push({
        x: dateKey,
        y: dateValue,
      })
    })
  }

  Object.keys(parsedData)
    .sort()
    // reverse alphabetic order because nivo graphs revert the order for the legend/tooltip
    .reverse()
    .map(geoId => {
      result.push({
        id: geoIdToNameMapping[geoId] ?? geoId,
        geoId: geoId,
        data: sortArrayByDateProperty(parsedData[geoId], 'x'),
      })
    })

  return {
    lineData: result,
    logarithmParams: logarithmParams,
  }
}

const sortArrayByDateProperty = <T extends Record<string, any>>(array: Array<T>, datePropertyKey: string): Array<T> => {
  return array.sort(
    (a, b) => moment(a[datePropertyKey], DATE_FORMAT_APP).unix() - moment(b[datePropertyKey], DATE_FORMAT_APP).unix()
  )
}
