import moment from 'moment'
import {DATE_FILTER, DATE_FORMAT_APP, DATE_FORMAT_ECDC} from './constants'

export const parseRawData = rawData => {
  const perDateData = {}
  const datesAvailable = new Set()
  const globalPerDay = []

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

const parseSectionData = (perDayData, startDate, endDate) => {
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

export const getTableData = (data, dateFilter) => {
  if (dateFilter.mode === DATE_FILTER.SINGLE_DAY) {
    return data.perDateData[dateFilter.startDate] || null
  }

  let startDate = null
  let endDate = null
  if (dateFilter.startDate) {
    startDate = moment(dateFilter.startDate, DATE_FORMAT_APP)
  }
  if (dateFilter.endDate) {
    endDate = moment(dateFilter.endDate, DATE_FORMAT_APP)
  }

  return parseSectionData(data.perDateData, startDate, endDate)
}
