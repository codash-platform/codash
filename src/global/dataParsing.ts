import moment from 'moment'
import {DATE_FORMAT_APP, DATE_FORMAT_ECDC, GEOID_WORLD_WIDE_COMBINED, GRAPH_SCALE, METRIC} from './constants'
import {
  AccumulatedDataEntry,
  BarData,
  BarEntryData,
  Data,
  DataEntry,
  DateFilter,
  GeoIdInfo,
  GraphData,
  InitialDataEntry,
  LineData,
  LineGraphData,
  LineParsedData,
  RatesDataEntry,
  RawData,
  TableDataEntry,
} from './typeUtils'

export const parseRawData = (rawData: Array<RawData>): Data => {
  const initialPerDateData: Record<string, InitialDataEntry[]> = {}
  const ratesPerDateData: Record<string, RatesDataEntry[]> = {}
  const globalPerDay: Record<string, InitialDataEntry> = {}
  const datesAvailable = new Set<string>()
  const geoIds = new Set<string>()
  const geoIdInfo: GeoIdInfo = {}

  if (!rawData[0]?.dateRep) {
    return null
  }

  rawData.map(record => {
    const cases = parseInt(record.cases)
    const deaths = parseInt(record.deaths)
    const population =
      geoIdInfo[record.geoId]?.population
      ?? (parseInt(record.popData2019) || parseInt(record.popData2018) || getMissingPopulation(record))
    const name = geoIdInfo[record.geoId]?.name ?? record.countriesAndTerritories.split('_').join(' ')
    const dateKey = moment(record.dateRep, DATE_FORMAT_ECDC).format(DATE_FORMAT_APP)

    datesAvailable.add(dateKey)
    geoIds.add(record.geoId)
    geoIdInfo[record.geoId] = {
      name: name,
      population: population,
    }

    if (!initialPerDateData[dateKey]) {
      initialPerDateData[dateKey] = []
    }

    initialPerDateData[dateKey].push({
      [METRIC.CASES_NEW]: cases,
      [METRIC.DEATHS_NEW]: deaths,
      geoId: record.geoId,
    })

    if (!globalPerDay[dateKey]) {
      globalPerDay[dateKey] = createInitialEntryPerCountry(GEOID_WORLD_WIDE_COMBINED)
    }

    globalPerDay[dateKey][METRIC.CASES_NEW] += cases
    globalPerDay[dateKey][METRIC.DEATHS_NEW] += deaths
  })

  let globalPopulation = 0
  Object.values(geoIdInfo).map(geoIdInfo => {
    globalPopulation += geoIdInfo.population
  })
  geoIdInfo[GEOID_WORLD_WIDE_COMBINED] = {
    name: 'Combined Data',
    population: globalPopulation,
  }

  for (const dateKey of Object.keys(initialPerDateData)) {
    initialPerDateData[dateKey].push(globalPerDay[dateKey])
    ratesPerDateData[dateKey] = calculateRatesData(initialPerDateData[dateKey], geoIdInfo)
  }
  const sortedDates = getSortedDates(datesAvailable)
  const perDateData = calculateAccumulatedData(ratesPerDateData, sortedDates, geoIdInfo)

  const allGeoIds = [...geoIds].sort()
  const visibleGeoIds = {}
  allGeoIds.map(geoId => {
    visibleGeoIds[geoId] = true
  })

  return {
    rawData: rawData,
    startDate: sortedDates[0] ?? null,
    endDate: sortedDates[sortedDates.length - 1] ?? null,
    datesAvailable: sortedDates,
    visibleGeoIds: visibleGeoIds,
    allGeoIds: allGeoIds,
    geoIdInfo: geoIdInfo,
    perDateData: perDateData,
  }
}

const getSortedDates = (datesSet: Set<string>): string[] => {
  return [...datesSet].sort((a, b) => moment(a, DATE_FORMAT_APP).unix() - moment(b, DATE_FORMAT_APP).unix())
}

const calculateRatesData = <T extends InitialDataEntry, U extends RatesDataEntry>(
  data: T[],
  geoIdInfo: GeoIdInfo,
): U[] => {
  const result: RatesDataEntry[] = data.map(element => ({
    ...element,
    [METRIC.CASES_PER_CAPITA]: calculateRate(element[METRIC.CASES_NEW], geoIdInfo[element.geoId].population, 1000000),
    [METRIC.DEATHS_PER_CAPITA]: calculateRate(element[METRIC.DEATHS_NEW], geoIdInfo[element.geoId].population, 1000000),
    [METRIC.MORTALITY_PERCENTAGE]: calculateRate(element[METRIC.DEATHS_NEW], element[METRIC.CASES_NEW], 100),
  }))

  return result as U[]
}

const calculateAccumulatedData = (
  perDateData: Record<string, InitialDataEntry[]>,
  sortedDates: string[],
  geoIdInfo: GeoIdInfo,
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
        geoIdInfo[entry.geoId].population,
        1000000,
      )
      entry[METRIC.DEATHS_PER_CAPITA_ACCUMULATED] = calculateRate(
        perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED],
        geoIdInfo[entry.geoId].population,
        1000000,
      )
      entry[METRIC.MORTALITY_PERCENTAGE_ACCUMULATED] = calculateRate(
        perGeoIdAccumulatedData[entry.geoId][METRIC.DEATHS_ACCUMULATED],
        perGeoIdAccumulatedData[entry.geoId][METRIC.CASES_ACCUMULATED],
        100,
      )
    })
  }

  return perDateData as Record<string, DataEntry[]>
}

const parseSectionData = (
  perDateData: Record<string, InitialDataEntry[]> = {},
  startDate: moment.Moment,
  endDate: moment.Moment,
  visibleGeoIds: Record<string, boolean>,
  geoIdInfo: GeoIdInfo,
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
      if (!visibleGeoIds[entry.geoId] && entry.geoId !== GEOID_WORLD_WIDE_COMBINED) {
        continue
      }

      if (!perGeoIdData[entry.geoId]) {
        perGeoIdData[entry.geoId] = createInitialEntryPerCountry(entry.geoId)
      }
      perGeoIdData[entry.geoId][METRIC.CASES_NEW] += entry[METRIC.CASES_NEW]
      perGeoIdData[entry.geoId][METRIC.DEATHS_NEW] += entry[METRIC.DEATHS_NEW]
    }
  }

  const endDateKey = endDate.format(DATE_FORMAT_APP)
  perDateData?.[endDateKey]?.map(entry => {
    if (!visibleGeoIds[entry.geoId] && entry.geoId !== GEOID_WORLD_WIDE_COMBINED) {
      return
    }

    if (!perGeoIdData[entry.geoId]) {
      perGeoIdData[entry.geoId] = createInitialEntryPerCountry(entry.geoId)
    }
    perGeoIdData[entry.geoId][METRIC.CASES_ACCUMULATED] = entry[METRIC.CASES_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.DEATHS_ACCUMULATED] = entry[METRIC.DEATHS_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.CASES_PER_CAPITA_ACCUMULATED] = entry[METRIC.CASES_PER_CAPITA_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.DEATHS_PER_CAPITA_ACCUMULATED] = entry[METRIC.DEATHS_PER_CAPITA_ACCUMULATED]
    perGeoIdData[entry.geoId][METRIC.MORTALITY_PERCENTAGE_ACCUMULATED] = entry[METRIC.MORTALITY_PERCENTAGE_ACCUMULATED]
  })

  const resultData: InitialDataEntry[] = Object.values(perGeoIdData)

  return calculateRatesData(resultData, geoIdInfo)
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

const createInitialEntryPerCountry = (geoId: string): InitialDataEntry => {
  return {
    [METRIC.CASES_NEW]: 0,
    [METRIC.DEATHS_NEW]: 0,
    geoId: geoId,
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
  selectedGeoIds: Record<string, boolean>,
  maxSelectionReached: boolean,
): TableDataEntry[] => {
  const startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  const endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)

  const sectionData = parseSectionData(data?.perDateData, startDate, endDate, data?.visibleGeoIds, data?.geoIdInfo)

  return addExtraInfo(sectionData, selectedGeoIds, maxSelectionReached, data.geoIdInfo)
}

const addExtraInfo = (
  tableData: DataEntry[],
  selectedGeoIds: Record<string, boolean>,
  maxSelectionReached: boolean,
  geoIdInfo: GeoIdInfo,
): TableDataEntry[] => {
  return tableData.map(entry => {
    return {
      ...entry,
      selected: !!selectedGeoIds[entry.geoId],
      maxSelectionReached: maxSelectionReached,
      name: geoIdInfo[entry.geoId].name,
      population: geoIdInfo[entry.geoId].population,
    }
  })
}

export const getGraphData = (
  data: Data,
  dateFilter: DateFilter,
  selectedGeoIds: Record<string, boolean>,
  propertyName: string,
  lineGraphVisible: boolean,
  barGraphVisible: boolean,
  graphScale: string,
): Partial<GraphData> => {
  const result: Partial<GraphData> = {}

  if (!data?.perDateData) {
    return result
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

    cleanedData[dateKey] = entriesForDate.filter(
      entry => selectedGeoIds[entry.geoId] && data.visibleGeoIds[entry.geoId],
    )
  }

  if (lineGraphVisible) {
    const {lineData, logarithmParams} = getLineGraphData(cleanedData, data.geoIdInfo, propertyName, graphScale)
    result.lineData = lineData
    result.logarithmParams = logarithmParams
  }

  if (barGraphVisible) {
    result.barData = getBarGraphData(cleanedData, data.geoIdInfo, selectedGeoIds, propertyName)
  }

  return result as GraphData
}

const getBarGraphData = (
  cleanedData: Record<string, DataEntry[]>,
  geoIdInfo: GeoIdInfo,
  selectedGeoIds: Record<string, boolean>,
  propertyName: string,
): BarData => {
  const parsedData: BarEntryData[] = []

  for (const [dateKey, entriesForDate] of Object.entries(cleanedData)) {
    const newEntry = {date: dateKey, nameToGeoId: {}}
    entriesForDate.forEach(entry => {
      newEntry[geoIdInfo[entry.geoId].name] = entry[propertyName]
      newEntry.nameToGeoId[geoIdInfo[entry.geoId].name] = entry.geoId
    })
    parsedData.push(newEntry)
  }

  const geoIdList = Object.entries(selectedGeoIds)
    .filter(([key, value]) => value)
    .map(([key, value]) => key)
    .sort()

  const keys = geoIdList.map(geoId => geoIdInfo[geoId].name)

  return {
    keys: keys,
    data: sortArrayByDateProperty(parsedData, 'date'),
  }
}

const getLineGraphData = (
  cleanedData: Record<string, DataEntry[]>,
  geoIdInfo: GeoIdInfo,
  propertyName: string,
  graphScale: string,
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
        id: geoIdInfo[geoId].name ?? geoId,
        geoId: geoId,
        data: sortArrayByDateProperty(parsedData[geoId], 'x'),
      })
    })

  return {
    lineData: result,
    logarithmParams: logarithmParams,
  }
}

const sortArrayByDateProperty = <T extends Record<string, unknown>>(array: Array<T>, datePropertyKey: string): Array<T> => {
  return array.sort(
    (a, b) => moment(a[datePropertyKey], DATE_FORMAT_APP).unix() - moment(b[datePropertyKey], DATE_FORMAT_APP).unix(),
  )
}
