import moment from 'moment'
import {TABLE_MODES} from './constants'

const ECDC_DATE_FORMAT = 'DD/MM/YYYY'
const APP_DATE_FORMAT = 'DD.MM.YYYY'

export const parseRawData = rawData => {
  let mostRecentDate = null
  const perDayData = {}
  const datesAvailable = new Set()
  const globalPerDay = []

  if (!rawData[0].dateRep) {
    return null
  }

  mostRecentDate = moment(rawData[0].dateRep, ECDC_DATE_FORMAT)
  rawData.map(record => {
    const testDate = moment(record.dateRep, ECDC_DATE_FORMAT)
    if (testDate.isAfter(mostRecentDate, 'day')) {
      mostRecentDate = testDate
    }
  })

  rawData.map(record => {
    const cases = parseInt(record.cases)
    const deaths = parseInt(record.deaths)
    const population = parseInt(record.popData2018) || getMissingPopulation(record)
    const name = record.countriesAndTerritories.split('_').join(' ')
    const dateKey = record.dateRep.split('/').join('.')

    datesAvailable.add(dateKey)

    if (!perDayData[dateKey]) {
      perDayData[dateKey] = []
    }

    perDayData[dateKey].push({
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

  for (let [key, value] of Object.entries(perDayData)) {
    perDayData[key].push(globalPerDay[key])
    perDayData[key] = calculateAdditionalData(perDayData[key])
  }

  const totalData = parseSectionData(perDayData)
  const last7Days = parseSectionData(perDayData, mostRecentDate.clone().subtract(7, 'days'))
  const last14Days = parseSectionData(perDayData, mostRecentDate.clone().subtract(14, 'days'))

  return {
    rawData: rawData,
    mostRecentDay: mostRecentDate && mostRecentDate.format(APP_DATE_FORMAT),
    datesAvailable: getSortedDates(datesAvailable),
    [TABLE_MODES.TOTAL]: totalData,
    [TABLE_MODES.LAST7DAYS]: last7Days,
    [TABLE_MODES.LAST14DAYS]: last14Days,
    [TABLE_MODES.SINGLE_DAY]: perDayData,
  }
}

const getSortedDates = datesSet => {
  return [...datesSet].sort((a, b) => moment(b, APP_DATE_FORMAT).toDate() - moment(a, APP_DATE_FORMAT).toDate())
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
    if (startDate && moment(dateKey, APP_DATE_FORMAT).isBefore(startDate, 'day')) {
      continue
    }

    if (endDate && moment(dateKey, APP_DATE_FORMAT).isAfter(endDate, 'day')) {
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
