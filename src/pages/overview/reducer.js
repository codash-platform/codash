import moment from 'moment'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_CLEAR_NOTIFICATION,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_PARSE_URL_PARAMS,
  ACTION_REPARSE_DATA,
  ACTION_SET_NOTIFICATION,
  ASYNC_STATUS,
  DATE_FILTER,
  DATE_FORMAT_APP,
  URL_ELEMENT_SEPARATOR,
  VIEW_MODE,
} from '../../global/constants'
import {parseRawData} from '../../global/dataParsing'

const initialState = {
  notification: {},
  loadingStatus: ASYNC_STATUS.IDLE,
  data: null,
  viewMode: VIEW_MODE.COMBO,
  tableVisible: true,
  graphsVisible: true,
  dateFilter: {
    startDate: null,
    endDate: null,
    mode: DATE_FILTER.TOTAL,
  },
  selectedGeoIds: {},
}

const preselectedGeoIds = ['US', 'CN', 'DE', 'FR', 'ES', 'IT', 'CH']

export const overview = (state = initialState, action = {}) => {
  // noinspection FallThroughInSwitchStatementJS
  switch (action.type) {
    case ACTION_SET_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          message: action.message,
          variant: action.variant || 'info',
          showSpinner: action.showSpinner || false,
        },
      }

    case ACTION_CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: initialState.notification,
      }

    case ACTION_PARSE_URL_PARAMS:
      let newStateParams = {...state}
      const {params} = action

      if (Object.values(VIEW_MODE).includes(params.viewMode)) {
        newStateParams = {
          ...newStateParams,
          ...processViewMode(params.viewMode),
        }
      }

      if (Object.values(DATE_FILTER).includes(params.startDate)) {
        newStateParams = {
          ...newStateParams,
          dateFilter: {
            ...newStateParams.dateFilter,
            ...processDateFilterMode(params.startDate, null, null),
          },
        }
      } else if (params.startDate || params.endDate) {
        newStateParams = {
          ...newStateParams,
          dateFilter: {
            ...newStateParams.dateFilter,
            ...processDateFilterChange(params.startDate, params.endDate),
          },
        }
      }

      if (params.selectedGeoIds) {
        const selectedGeoIds = {}
        params.selectedGeoIds.split(URL_ELEMENT_SEPARATOR).map(geoId => (selectedGeoIds[geoId] = true))

        newStateParams = {
          ...newStateParams,
          selectedGeoIds: selectedGeoIds,
        }
      }

      return newStateParams

    case ACTION_GET_DATA_START:
      return {
        ...state,
        loadingStatus: ASYNC_STATUS.PENDING,
      }

    case ACTION_REPARSE_DATA:
      if (!state.data?.rawData) {
        return {
          ...state,
          notification: {
            ...state.notification,
            message: 'global:error_no_data_loaded',
            variant: 'danger',
            showSpinner: false,
          },
        }
      }
      action.result = {
        records: state.data.rawData,
      }
    // intentional fallthrough
    case ACTION_GET_DATA_SUCCESS:
      const parsedData = parseRawData(action.result.records)
      if (!parsedData) {
        return {
          ...state,
          notification: {
            ...state.notification,
            message: 'global:error_invalid_api_data',
            variant: 'danger',
            showSpinner: false,
          },
        }
      }

      let selectedGeoIds = {}
      if (Object.keys(state.selectedGeoIds).length === 0 && parsedData.geoIds) {
        parsedData.geoIds.map(geoId => {
          selectedGeoIds[geoId] = preselectedGeoIds.includes(geoId)
        })
      }

      return {
        ...state,
        loadingStatus: ASYNC_STATUS.SUCCESS,
        data: {
          ...state.data,
          ...parsedData,
        },
        dateFilter: {
          startDate: moment(parsedData.endDate, DATE_FORMAT_APP)
            .subtract(14, 'days')
            .format(DATE_FORMAT_APP),
          endDate: parsedData.endDate,
          mode: DATE_FILTER.LAST_14_DAYS,
        },
        selectedGeoIds: {
          ...state.selectedGeoIds,
          ...selectedGeoIds,
        },
      }

    case ACTION_GET_DATA_FAIL:
      return {
        ...state,
        loadingStatus: ASYNC_STATUS.FAIL,
        notification: {
          ...state.notification,
          message: action.error,
          variant: 'danger',
          showSpinner: false,
        },
      }

    case ACTION_CHANGE_DATE_FILTER_MODE:
      const parsedDateFilterState = processDateFilterMode(action.filterMode, state.data?.startDate, state.data?.endDate)

      return {
        ...state,
        dateFilter: {
          ...state.dateFilter,
          ...parsedDateFilterState,
        },
      }

    case ACTION_CHANGE_DATE_FILTER_INTERVAL:
      let newDateFilterState = processDateFilterChange(action.startDate, action.endDate)

      return {
        ...state,
        dateFilter: {
          ...state.dateFilter,
          ...newDateFilterState,
        },
      }

    case ACTION_CHANGE_GEOID_SELECTION:
      const newSelectedGeoIds = {...state.selectedGeoIds}
      newSelectedGeoIds[action.geoId] = action.selected

      return {
        ...state,
        selectedGeoIds: newSelectedGeoIds,
      }

    case ACTION_CHANGE_VIEW_MODE:
      return {
        ...state,
        ...processViewMode(action.viewMode),
      }

    default:
      return state
  }
}

const processViewMode = viewMode => {
  let tableVisible = true
  let graphsVisible = true

  switch (viewMode) {
    default:
    case VIEW_MODE.COMBO:
      break
    case VIEW_MODE.GRAPHS:
      tableVisible = false
      break
    case VIEW_MODE.TABLE:
      graphsVisible = false
      break
  }

  return {
    viewMode: viewMode,
    tableVisible: tableVisible,
    graphsVisible: graphsVisible,
  }
}

const processDateFilterMode = (dateFilterMode, dataStartDate, dataEndDate) => {
  const dateFilter = {
    startDate: dataStartDate,
    endDate: dataEndDate,
    mode: dateFilterMode,
  }

  switch (dateFilterMode) {
    case DATE_FILTER.TOTAL:
      break
    default:
      const daysCount = parseInt(dateFilterMode)
      if (dataEndDate && Object.values(DATE_FILTER).includes(daysCount)) {
        dateFilter.startDate = moment(dataEndDate, DATE_FORMAT_APP)
          .subtract(daysCount - 1, 'days')
          .format(DATE_FORMAT_APP)
      }
      break
  }

  return dateFilter
}

const processDateFilterChange = (startDate, endDate) => {
  const newDateFilterState = {}
  if (startDate) {
    newDateFilterState.startDate = startDate
    newDateFilterState.mode = null
  }
  if (endDate) {
    newDateFilterState.endDate = endDate
    newDateFilterState.mode = null
  }

  return newDateFilterState
}
