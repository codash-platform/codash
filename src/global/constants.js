export const ASYNC_STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

export const TABLE_MODES = {
  TOTAL: 'TOTAL',
  CUSTOM_INTERVAL: 'CUSTOM_INTERVAL',
  LAST7DAYS: 'LAST7DAYS',
  LAST14DAYS: 'LAST14DAYS',
  SINGLE_DAY: 'SINGLE_DAY',
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
export const ACTION_CHANGE_DATA_SOURCE = 'ACTION_CHANGE_DATA_SOURCE'
export const ACTION_CHANGE_SELECTED_DAY = 'ACTION_CHANGE_SELECTED_DAY'
export const ACTION_REPARSE_DATA = 'ACTION_REPARSE_DATA'
export const ACTION_CHANGE_SIZE_PER_PAGE = 'ACTION_CHANGE_SIZE_PER_PAGE'

export const ACTION_HEADER_MESSAGE_SET = 'ACTION_HEADER_MESSAGE_SET'
export const ACTION_HEADER_MESSAGE_CLEAR = 'ACTION_HEADER_MESSAGE_CLEAR'

export const REDUX_STORE_VERSION = '2'
export const REDUX_STORE_VERSION_PROPERTY = 'version'
