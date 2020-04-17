import moment from 'moment'
import {DATE_FILTER, DATE_FORMAT_APP, DATE_FORMAT_ECDC} from './constants'

export const parseRawData = rawData => {
  const perDateData = {}
  const globalPerDay = []
  const datesAvailable = new Set()
  const geoIds = new Set()
  const geoIdToNameMapping = {}

  if (!rawData[0]?.dateRep) {
    return null
  }

  rawData.map(record => {
    const cases = parseInt(record.cases)
    const deaths = parseInt(record.deaths)
    const population = parseInt(record.popData2018) || getMissingPopulation(record)
    const name = record.countriesAndTerritories.split('_').join(' ')
    const dateKey = moment(record.dateRep, DATE_FORMAT_ECDC).format(DATE_FORMAT_APP)

    datesAvailable.add(dateKey)
    geoIds.add(record.geoId)
    geoIdToNameMapping[record.geoId] = name

    if (!perDateData[dateKey]) {
      perDateData[dateKey] = []
    }

    perDateData[dateKey].push({
      name: name,
      cases: cases,
      deaths: deaths,
      geoId: record.geoId,
      population: population,
    })

    if (!globalPerDay[dateKey]) {
      globalPerDay[dateKey] = createInitialEntryPerCountry('Combined Data', 'WW', 0)
    }

    globalPerDay[dateKey].cases += cases
    globalPerDay[dateKey].deaths += deaths
    // todo fix calculation bug
    globalPerDay[dateKey].population += population
  })

  for (let [key, value] of Object.entries(perDateData)) {
    perDateData[key].push(globalPerDay[key])
    perDateData[key] = calculateAdditionalData(perDateData[key])
  }
  const sortedDates = getSortedDates(datesAvailable)

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

const getSortedDates = datesSet => {
  return [...datesSet].sort((a, b) => moment(a, DATE_FORMAT_APP).toDate() - moment(b, DATE_FORMAT_APP).toDate())
}

const calculateAdditionalData = data => {
  return data.map(element => {
    // if (element.geoId === 'JPG11668') debugger

    element.infectionPerCapita = calculateRate(element.cases, element.population, 1000000)
    element.mortalityPerCapita = calculateRate(element.deaths, element.population, 1000000)
    element.mortalityPercentage = calculateRate(element.deaths, element.cases, 100)

    return element
  })
}

const parseSectionData = (perDayData = {}, startDate, endDate) => {
  let resultData = []
  const perCountryData = {}

  for (let [dateKey, entriesForDate] of Object.entries(perDayData)) {
    if (startDate && moment(dateKey, DATE_FORMAT_APP).isBefore(startDate, 'day')) {
      continue
    }

    if (endDate && moment(dateKey, DATE_FORMAT_APP).isAfter(endDate, 'day')) {
      continue
    }

    for (let entry of entriesForDate) {
      if (!perCountryData[entry.geoId]) {
        perCountryData[entry.geoId] = createInitialEntryPerCountry(entry.name, entry.geoId, entry.population)
      }
      perCountryData[entry.geoId].cases += entry.cases
      perCountryData[entry.geoId].deaths += entry.deaths
    }
  }

  resultData = Object.values(perCountryData)
  resultData = calculateAdditionalData(resultData)

  return resultData
}

/**
 * Per million rate
 * @param cases
 * @param total
 * @param referenceRate
 * @returns {number}
 */
const calculateRate = (cases, total, referenceRate) => {
  return changePrecision(cases / (total / referenceRate), 2)
}

const changePrecision = (number, precision) => {
  const factor = Math.pow(10, precision)
  const tempNumber = number * factor
  const roundedTempNumber = Math.round(tempNumber)

  return roundedTempNumber / factor
}

const createInitialEntryPerCountry = (name, geoId, population) => {
  return {
    cases: 0,
    deaths: 0,
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
  FK: 3234,
}

const getMissingPopulation = element => {
  let population = null
  if (!!hardcodedPopulationData[element.geoId]) {
    population = hardcodedPopulationData[element.geoId]
  }

  return population
}

export const getTableData = (data, dateFilter, selectedGeoIds) => {
  if (dateFilter.mode === DATE_FILTER.SINGLE_DAY) {
    if (!data.perDateData[dateFilter.startDate]) {
      return []
    }
    return addSelectionColumn(data.perDateData[dateFilter.startDate], selectedGeoIds)
  }

  let startDate = null
  let endDate = null
  if (dateFilter.startDate) {
    startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  }
  if (dateFilter.endDate) {
    endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)
  }

  const sectionData = parseSectionData(data?.perDateData, startDate, endDate)

  return addSelectionColumn(sectionData, selectedGeoIds)
}

const addSelectionColumn = (tableData, selectedGeoIds) => {
  return tableData.map(entry => {
    entry.selected = selectedGeoIds[entry.geoId] || false

    return entry
  })
}

export const getGraphData = (data, dateFilter, selectedGeoIds) => {
  if (!data?.perDateData) {
    return []
  }

  const startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  const endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)
  const cleanedData = {}

  for (let [dateKey, entriesForDate] of Object.entries(data.perDateData)) {
    const dateObj = moment(dateKey, DATE_FORMAT_APP)

    if (startDate.isValid() && dateObj.isBefore(startDate, 'day')) {
      continue
    }

    if (endDate.isValid() && dateObj.isAfter(endDate, 'day')) {
      continue
    }

    cleanedData[dateKey] = entriesForDate.filter(entry => !!selectedGeoIds[entry.geoId])
  }

  return {
    lineData: getLineGraphData(cleanedData, data.geoIdToNameMapping),
    barData: getBarGraphData(cleanedData, data.geoIdToNameMapping, selectedGeoIds),
  }
}

const getBarGraphData = (cleanedData, geoIdToNameMapping, selectedGeoIds) => {
  const parsedData = []

  for (let [dateKey, entriesForDate] of Object.entries(cleanedData)) {
    const newEntry = {date: dateKey}
    entriesForDate.map(entry => {
      newEntry[geoIdToNameMapping[entry.geoId]] = entry.cases
    })
    parsedData.push(newEntry)
  }

  const keys = Object.entries(selectedGeoIds)
    .filter(([key, value]) => value)
    .map(([key, value]) => geoIdToNameMapping[key])

  return {
    keys: keys,
    data: sortArrayByDateProperty(parsedData, 'date'),
  }
}

const getLineGraphData = (cleanedData, geoIdToNameMapping) => {
  const result = []
  let parsedData = {}

  for (let [dateKey, entriesForDate] of Object.entries(cleanedData)) {
    entriesForDate.map(entry => {
      if (!parsedData[entry.geoId]) {
        parsedData[entry.geoId] = []
      }

      parsedData[entry.geoId].push({
        x: dateKey,
        y: entry.cases,
      })
    })
  }

  for (let [geoId, countryData] of Object.entries(parsedData)) {
    result.push({
      id: geoIdToNameMapping[geoId] || geoId,
      data: sortArrayByDateProperty(countryData, 'x'),
    })
  }

  return result
}

const sortArrayByDateProperty = (array, datePropertyKey) => {
  return array.sort(
    (a, b) =>
      moment(a[datePropertyKey], DATE_FORMAT_APP).toDate() - moment(b[datePropertyKey], DATE_FORMAT_APP).toDate()
  )
}
