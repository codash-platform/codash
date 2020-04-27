export const ASYNC_STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

export const DATE_FILTER = {
  TOTAL: 'TOTAL',
  LAST_DAY: 1,
  LAST_7_DAYS: 7,
  LAST_14_DAYS: 14,
  LAST_30_DAYS: 30,
  LAST_60_DAYS: 60,
}

export const VIEW_MODE = {
  COMBO: 'COMBO',
  TABLE: 'TABLE',
  GRAPHS: 'GRAPHS',
}

export const GRAPH_MODE = {
  COMBO: 'COMBO',
  LINE: 'LINE',
  BAR: 'BAR',
}

export const METRICS = {
  CASES_NEW: 'cases',
  CASES_ACCUMULATED: 'casesAccumulated',
  CASES_PER_CAPITA: 'infectionPerCapita',
  CASES_PER_CAPITA_ACCUMULATED: 'infectionPerCapitaAccumulated',
  DEATHS_NEW: 'deaths',
  DEATHS_ACCUMULATED: 'deathsAccumulated',
  DEATHS_PER_CAPITA: 'mortalityPerCapita',
  DEATHS_PER_CAPITA_ACCUMULATED: 'mortalityPerCapitaAccumulated',
  MORTALITY_PERCENTAGE: 'mortalityPercentage',
  MORTALITY_PERCENTAGE_ACCUMULATED: 'mortalityPercentageAccumulated',
}

// the expiry time of the local storage used for the redux store in minutes
export const STORAGE_EXPIRY_TIMEOUT = 30
export const STORAGE_EXPIRY_KEY = 'updatedAt'
// used to save the current store in localStorage for faster reload
export const REDUX_STORE_STORAGE_NAME = 'dataStore'

// route urls
export const ROUTE_TABLE_OVERVIEW = '/overview'

export const ACTION_GET_DATA_START = 'ACTION_GET_DATA_START'
export const ACTION_GET_DATA_SUCCESS = 'ACTION_GET_DATA_SUCCESS'
export const ACTION_GET_DATA_FAIL = 'ACTION_GET_DATA_FAIL'
export const ACTION_CHANGE_DATE_FILTER_MODE = 'ACTION_CHANGE_DATE_FILTER_MODE'
export const ACTION_CHANGE_DATE_FILTER_INTERVAL = 'ACTION_CHANGE_DATE_FILTER_INTERVAL'
export const ACTION_REPARSE_DATA = 'ACTION_REPARSE_DATA'
export const ACTION_CHANGE_SIZE_PER_PAGE = 'ACTION_CHANGE_SIZE_PER_PAGE'
export const ACTION_CHANGE_GEOID_SELECTION = 'ACTION_CHANGE_GEOID_SELECTION'
export const ACTION_CHANGE_VIEW_MODE = 'ACTION_CHANGE_VIEW_MODE'
export const ACTION_CHANGE_GRAPH_MODE = 'ACTION_CHANGE_GRAPH_MODE'
export const ACTION_CHANGE_METRIC_GRAPH_VISIBILITY = 'ACTION_CHANGE_METRIC_GRAPH_VISIBILITY'
export const ACTION_CHANGE_ALL_METRIC_GRAPH_VISIBILITY = 'ACTION_CHANGE_ALL_METRIC_GRAPH_VISIBILITY'

export const ACTION_SET_NOTIFICATION = 'ACTION_SET_NOTIFICATION'
export const ACTION_CLEAR_NOTIFICATION = 'ACTION_CLEAR_NOTIFICATION'

export const REDUX_STORE_VERSION = '3'
export const REDUX_STORE_VERSION_PROPERTY = 'version'

export const DATE_FORMAT_ECDC = 'DD/MM/YYYY'
export const DATE_FORMAT_APP = 'DD.MM.YYYY'
export const DATE_TIME_FORMAT_APP = 'HH:mm DD.MM.YYYY'
export const LOCALE_DEFAULT = 'de-ch'
