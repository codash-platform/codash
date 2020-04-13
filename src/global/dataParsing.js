import moment from 'moment'

export const parseRawData = rawData => {
  const totalPerCountry = {}
  const perDayData = {}
  const datesAvailable = new Set()
  let mostRecentDate = null
  const globalTotal = createInitialEntryPerCountry('Global', 'WW', 0)
  const globalPerDay = []

  if (!!rawData[0].dateRep) {
    mostRecentDate = moment(rawData[0].dateRep, 'DD/MM/YYYY"')

    rawData.map(record => {
      const testDate = moment(record.dateRep, 'DD/MM/YYYY"')
      if (testDate.isAfter(mostRecentDate)) {
        mostRecentDate = testDate
      }
    })

    const mostRecentDay = mostRecentDate.date().toString()
    const mostRecentMonth = (mostRecentDate.month() + 1).toString()
    const mostRecentYear = mostRecentDate.year().toString()

    rawData.map(record => {
      const cases = parseInt(record.cases)
      const deaths = parseInt(record.deaths)
      const population = parseInt(record.popData2018) || getMissingPopulation(record)
      const name = record.countriesAndTerritories.split('_').join(' ')
      const dateKey = record.dateRep.split('/').join('.')

      datesAvailable.add(dateKey)

      if (!totalPerCountry[record.geoId]) {
        totalPerCountry[record.geoId] = createInitialEntryPerCountry(name, record.geoId, population)
      }

      totalPerCountry[record.geoId].cases += cases
      totalPerCountry[record.geoId].deaths += deaths
      globalTotal.cases += cases
      globalTotal.deaths += deaths

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
        globalPerDay[dateKey] = createInitialEntryPerCountry('Global', 'WW', 0)
      }

      globalPerDay[dateKey].cases += cases
      globalPerDay[dateKey].deaths += deaths
      // todo fix calculation bug
      globalPerDay[dateKey].population += population

      // TODO optimize
      if (record.day !== mostRecentDay || record.month !== mostRecentMonth || record.year !== mostRecentYear) {
        return
      }

      globalTotal.population += population
    })
  }
  let totalData = Object.values(totalPerCountry)
  totalData.push(globalTotal)
  totalData = calculateAdditionalData(totalData)

  for (let [key, value] of Object.entries(perDayData)) {
    perDayData[key].push(globalPerDay[key])
    perDayData[key] = calculateAdditionalData(perDayData[key])
  }

  return {
    rawData: rawData,
    mostRecentDay: mostRecentDate && mostRecentDate.format('DD.MM.YYYY'),
    perDayData: perDayData,
    datesAvailable: [...datesAvailable],
    total: totalData,
  }
}

const calculateAdditionalData = data => {
  return data.map(element => {
    // if (element.geoId === 'JPG11668') debugger
    // if (element.geoId === 'CZ') debugger

    element.infectionPerCapita = calculateRate(element.cases, element.population, 1000000)
    element.mortalityPerCapita = calculateRate(element.deaths, element.population, 1000000)
    element.mortalityPercentage = calculateRate(element.deaths, element.cases, 100)

    return element
  })
}

const hardcodedData = {
  AI: 14731,
  BQ: 25711,
  CZ: 10665677,
  ER: 3452786,
  FK: 3234,
}

const getMissingPopulation = element => {
  let population = null
  if (!!hardcodedData[element.geoId]) {
    population = hardcodedData[element.geoId]
  }

  return population
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
