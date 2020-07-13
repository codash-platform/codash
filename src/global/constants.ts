export enum ASYNC_STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum DATE_FILTER {
  TOTAL = 'total',
  LAST_DAY = '1',
  LAST_7_DAYS = '7',
  LAST_14_DAYS = '14',
  LAST_30_DAYS = '30',
  LAST_60_DAYS = '60',
  LAST_90_DAYS = '90',
}

export enum VIEW_MODE {
  COMBO = 'combo',
  TABLE = 'table',
  RANKINGS = 'rankings',
  GRAPHS = 'graphs',
}

export enum GRAPH_MODE {
  COMBO = 'combo',
  LINE = 'line',
  BAR = 'bar',
}

export enum GRAPH_SCALE {
  LINEAR = 'linear',
  LOGARITHMIC = 'logarithmic',
}

export enum METRICS {
  CASES_NEW = 'cases_new',
  CASES_ACCUMULATED = 'cases_accumulated',
  CASES_PER_CAPITA = 'cases_per_capita',
  CASES_PER_CAPITA_ACCUMULATED = 'cases_per_capita_accumulated',
  DEATHS_NEW = 'deaths_new',
  DEATHS_ACCUMULATED = 'deaths_accumulated',
  DEATHS_PER_CAPITA = 'deaths_per_capita',
  DEATHS_PER_CAPITA_ACCUMULATED = 'deaths_per_capita_accumulated',
  MORTALITY_PERCENTAGE = 'mortality_percentage',
  MORTALITY_PERCENTAGE_ACCUMULATED = 'mortality_percentage_accumulated',
}

export const TABLE_TYPE = {
  MAIN: 'main',
  ...METRICS,
}

export enum SIDEBAR_MENUS {
  INTERVALS_MENU = 'intervalsMenu',
  VIEW_MODE_MENU = 'viewModeMenu',
  GRAPH_MODE_MENU = 'graphModeMenu',
  GRAPH_SCALE_MENU = 'graphScaleMenu',
  GRAPH_METRICS_MENU = 'graphMetricsMenu',
}

// the expiry time of the local storage used for the redux store in minutes
export const STORAGE_EXPIRY_TIMEOUT = 60
export const STORAGE_EXPIRY_KEY = 'updatedAt'
// used to save the current store in localStorage for faster reload
export const REDUX_STORE_STORAGE_NAME = 'dataStore'

export const URL_ELEMENT_SEPARATOR = '-'

// route urls
export const ROUTE_DASHBOARD =
  '/:viewMode?/:startDate?/:endDate?/:graphMode?/:graphScale?/:selectedGeoIds?/:metricsVisible?'
export const ROUTE_EMPTY_PARAM = '-'

export const ACTION_PARSE_URL_PARAMS = 'ACTION_PARSE_URL_PARAMS'
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
export const ACTION_CHANGE_GRAPH_SCALE = 'ACTION_CHANGE_GRAPH_SCALE'
export const ACTION_CHANGE_METRIC_GRAPH_VISIBILITY = 'ACTION_CHANGE_METRIC_GRAPH_VISIBILITY'
export const ACTION_TOGGLE_SIDEBAR_MENU = 'ACTION_TOGGLE_SIDEBAR_MENU'
export const ACTION_EXPAND_ONLY_SIDEBAR_MENU = 'ACTION_EXPAND_ONLY_SIDEBAR_MENU'
export const ACTION_TOGGLE_DATE_FILTER = 'ACTION_TOGGLE_DATE_FILTER'
export const ACTION_CHANGE_TOUR_STATE = 'ACTION_CHANGE_TOUR_STATE'
export const ACTION_CHANGE_TOUR_COMPLETION = 'ACTION_CHANGE_TOUR_COMPLETION'

export const ACTION_SET_NOTIFICATION = 'ACTION_SET_NOTIFICATION'
export const ACTION_CLEAR_NOTIFICATION = 'ACTION_CLEAR_NOTIFICATION'

export const ACTION_ENABLE_MOBILE_MENU = 'ACTION_ENABLE_MOBILE_MENU'
export const ACTION_ENABLE_MOBILE_MENU_SMALL = 'ACTION_ENABLE_MOBILE_MENU_SMALL'
export const ACTION_ENABLE_FIXED_HEADER = 'ACTION_ENABLE_FIXED_HEADER'
export const ACTION_ENABLE_HEADER_SHADOW = 'ACTION_SET_ENABLE_HEADER_SHADOW'
export const ACTION_ENABLE_SIDEBAR_SHADOW = 'ACTION_ENABLE_SIDEBAR_SHADOW'
export const ACTION_ENABLE_FIXED_SIDEBAR = 'ACTION_ENABLE_FIXED_SIDEBAR'
export const ACTION_ENABLE_FIXED_FOOTER = 'ACTION_ENABLE_FIXED_FOOTER'
export const ACTION_ENABLE_PAGE_TITLE_ICON = 'ACTION_ENABLE_PAGE_TITLE_ICON'
export const ACTION_ENABLE_PAGE_TITLE_SUBHEADING = 'ACTION_ENABLE_PAGE_TITLE_SUBHEADING'
export const ACTION_ENABLE_PAGE_TABS_ALT = 'ACTION_ENABLE_PAGE_TABS_ALT'
export const ACTION_SET_BACKGROUND_COLOR = 'ACTION_SET_BACKGROUND_COLOR'
export const ACTION_SET_COLOR_SCHEME = 'ACTION_SET_COLOR_SCHEME'
export const ACTION_SET_HEADER_BACKGROUND_COLOR = 'ACTION_SET_HEADER_BACKGROUND_COLOR'
export const ACTION_TOGGLE_SIDEBAR = 'ACTION_TOGGLE_SIDEBAR'
export const ACTION_SET_DESKTOP_DEVICE = 'ACTION_SET_DESKTOP_DEVICE'

export const REDUX_STORE_VERSION = '4'
export const REDUX_STORE_VERSION_PROPERTY = 'version'

export const DATE_FORMAT_ECDC = 'DD/MM/YYYY'
export const DATE_FORMAT_APP = 'DD.MM.YYYY'
export const DATE_TIME_FORMAT_APP = 'HH:mm DD.MM.YYYY'
export const LOCALE_DEFAULT = 'de-ch'
