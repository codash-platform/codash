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

export enum METRIC {
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

export enum CONTINENT {
  ASIA = 'asia',
  EUROPE = 'europe',
  NORTH_AMERICA = 'north_america',
  SOUTH_AMERICA = 'south_america',
  AUSTRALIA = 'australia',
  AFRICA = 'africa',
  ANTARCTICA = 'antarctica',
}

export enum GENERAL_TABLE_TYPE {
  MAIN = 'main',
}

export const TABLE_TYPE = {
  ...GENERAL_TABLE_TYPE,
  ...METRIC,
}

export enum SIDEBAR_MENUS {
  INTERVALS_MENU = 'intervalsMenu',
  VIEW_MODE_MENU = 'viewModeMenu',
  FILTERS_CONTINENT_MENU = 'filtersContinentMenu',
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
  '/:viewMode?/:startDate?/:endDate?/:graphMode?/:graphScale?/:selectedGeoIds?/:metricsVisible?/:filtersContinent?'
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
export const ACTION_CHANGE_FILTERS_CONTINENT = 'ACTION_CHANGE_FILTERS_CONTINENT'
export const ACTION_UPDATE_GEOID_VISIBILITY = 'ACTION_UPDATE_GEOID_VISIBILITY'
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

export const GEOID_WORLD_WIDE_COMBINED = 'WW'

// use objects as data mappers to allow faster lookups
// prettier-ignore
export const CONTINENT_GEOID_MAP = {
  [CONTINENT.ASIA]: {'AF':1,'AZ':1,'BH':1,'BD':1,'AM':1,'BT':1,'IO':1,'BN':1,'MM':1,'KH':1,'LK':1,'CN':1,'TW':1,'CX':1,'CC':1,'CY':1,'GE':1,'PS':1,'HK':1,'IN':1,'ID':1,'IR':1,'IQ':1,'IL':1,'JP':1,'KZ':1,'JO':1,'KP':1,'KR':1,'KW':1,'KG':1,'LA':1,'LB':1,'MO':1,'MY':1,'MV':1,'MN':1,'OM':1,'NP':1,'PK':1,'PH':1,'TL':1,'QA':1,'RU':1,'SA':1,'SG':1,'VN':1,'SY':1,'TJ':1,'TH':1,'AE':1,'TR':1,'TM':1,'UZ':1,'YE':1,'XE':1,'XD':1,'XS':1},
  [CONTINENT.EUROPE]: {'AL':1,'AD':1,'AZ':1,'AT':1,'AM':1,'BE':1,'BA':1,'BG':1,'BY':1,'HR':1,'CY':1,'CZ':1,'DK':1,'EE':1,'FO':1,'FI':1,'AX':1,'FR':1,'GE':1,'DE':1,'GI':1,'GR':1,'EL':1,'VA':1,'HU':1,'IS':1,'IE':1,'IT':1,'KZ':1,'LV':1,'LI':1,'LT':1,'LU':1,'MT':1,'MC':1,'MD':1,'ME':1,'NL':1,'NO':1,'PL':1,'PT':1,'RO':1,'RU':1,'SM':1,'RS':1,'SK':1,'SI':1,'ES':1,'SJ':1,'SE':1,'CH':1,'TR':1,'UA':1,'MK':1,'GB':1,'UK':1,'GG':1,'JE':1,'IM':1,'XK':1},
  [CONTINENT.ANTARCTICA]: {'AQ':1,'BV':1,'GS':1,'TF':1,'HM':1},
  [CONTINENT.AFRICA]: {'DZ':1,'AO':1,'BW':1,'BI':1,'CM':1,'CV':1,'CF':1,'TD':1,'KM':1,'YT':1,'CG':1,'CD':1,'BJ':1,'GQ':1,'ET':1,'ER':1,'DJ':1,'GA':1,'GM':1,'GH':1,'GN':1,'CI':1,'KE':1,'LS':1,'LR':1,'LY':1,'MG':1,'MW':1,'ML':1,'MR':1,'MU':1,'MA':1,'MZ':1,'NA':1,'NE':1,'NG':1,'GW':1,'RE':1,'RW':1,'SH':1,'ST':1,'SN':1,'SC':1,'SL':1,'SO':1,'ZA':1,'ZW':1,'SS':1,'EH':1,'SD':1,'SZ':1,'TG':1,'TN':1,'UG':1,'EG':1,'TZ':1,'BF':1,'ZM':1},
  [CONTINENT.AUSTRALIA]: {'AS':1,'AU':1,'SB':1,'CK':1,'FJ':1,'PF':1,'KI':1,'GU':1,'NR':1,'NC':1,'VU':1,'NZ':1,'NU':1,'NF':1,'MP':1,'UM':1,'FM':1,'MH':1,'PW':1,'PG':1,'PN':1,'TK':1,'TO':1,'TV':1,'WF':1,'WS':1,'XX':1},
  [CONTINENT.NORTH_AMERICA]: {'AG':1,'BS':1,'BB':1,'BM':1,'BZ':1,'VG':1,'CA':1,'KY':1,'CR':1,'CU':1,'DM':1,'DO':1,'SV':1,'GL':1,'GD':1,'GP':1,'GT':1,'HT':1,'HN':1,'JM':1,'MQ':1,'MX':1,'MS':1,'AN':1,'CW':1,'AW':1,'SX':1,'BQ':1,'NI':1,'UM':1,'PA':1,'PR':1,'BL':1,'KN':1,'AI':1,'LC':1,'MF':1,'PM':1,'VC':1,'TT':1,'TC':1,'US':1,'VI':1},
  [CONTINENT.SOUTH_AMERICA]: {'AR':1,'BO':1,'BR':1,'CL':1,'CO':1,'EC':1,'FK':1,'GF':1,'GY':1,'PY':1,'PE':1,'SR':1,'UY':1,'VE':1},
}
