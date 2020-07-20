import moment from 'moment'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_TOUR_COMPLETION,
  ACTION_CHANGE_TOUR_STATE,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_CLEAR_NOTIFICATION,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_PARSE_URL_PARAMS,
  ACTION_REPARSE_DATA,
  ACTION_SET_NOTIFICATION,
  ACTION_TOGGLE_DATE_FILTER,
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
  rankingsVisible: true,
  graphsVisible: true,
  dateFilter: {
    startDate: null,
    endDate: null,
    mode: DATE_FILTER.TOTAL,
    focusedInput: null,
  },
  selectedGeoIds: {},
  tourEnabled: false,
  tourCompleted: false,
}

const preselectedGeoIds = ['US', 'CN', 'DE', 'FR', 'ES', 'IT', 'CH']

export const overview = (state = initialState, action: Record<string, any> = {}) => {
  // noinspection FallThroughInSwitchStatementJS
  switch (action.type) {
    case ACTION_SET_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          message: action.message,
          variant: action.variant ?? 'info',
          showSpinner: action.showSpinner ?? false,
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

      if (params.startDate) {
        const integerFilterValue = parseInt(params.startDate)
        const hasIntegerFilter = Number.isInteger(integerFilterValue)
        const filterValue = hasIntegerFilter ? integerFilterValue : params.startDate

        if (Object.values(DATE_FILTER).includes(filterValue)) {
          newStateParams = {
            ...newStateParams,
            dateFilter: {
              ...newStateParams.dateFilter,
              ...processDateFilterMode(filterValue, state.data?.startDate, state.data?.endDate),
            },
          }
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

        Object.keys(state.selectedGeoIds).map(geoId => (selectedGeoIds[geoId] = false))
        params.selectedGeoIds.split(URL_ELEMENT_SEPARATOR).map(geoId => {
          if (geoId) {
            selectedGeoIds[geoId] = true
          }
        })

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

      const selectedGeoIds = {}
      if (Object.keys(state.selectedGeoIds).length === 0 && parsedData.geoIds) {
        parsedData.geoIds.map((geoId: string) => {
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
      return {
        ...state,
        dateFilter: {
          ...state.dateFilter,
          ...processDateFilterMode(action.filterMode, state.data?.startDate, state.data?.endDate),
        },
      }

    case ACTION_CHANGE_DATE_FILTER_INTERVAL:
      return {
        ...state,
        dateFilter: {
          ...state.dateFilter,
          ...processDateFilterChange(action.startDate, action.endDate),
        },
      }

    case ACTION_CHANGE_GEOID_SELECTION:
      const newSelectedGeoIds = {...state.selectedGeoIds}
      if (action.geoId) {
        newSelectedGeoIds[action.geoId] = action.selected
      }

      return {
        ...state,
        selectedGeoIds: newSelectedGeoIds,
      }

    case ACTION_CHANGE_VIEW_MODE:
      return {
        ...state,
        ...processViewMode(action.viewMode),
      }

    case ACTION_TOGGLE_DATE_FILTER:
      return {
        ...state,
        dateFilter: {
          ...state.dateFilter,
          focusedInput: action.focusedInput,
        },
      }

    case ACTION_CHANGE_TOUR_STATE:
      return {
        ...state,
        tourEnabled: action.enabled,
      }

    case ACTION_CHANGE_TOUR_COMPLETION:
      return {
        ...state,
        tourCompleted: action.completed,
      }

    default:
      return state
  }
}

const processViewMode = viewMode => {
  let tableVisible = false
  let rankingsVisible = false
  let graphsVisible = false

  switch (viewMode) {
    default:
    case VIEW_MODE.COMBO:
      tableVisible = true
      rankingsVisible = true
      graphsVisible = true
      break
    case VIEW_MODE.GRAPHS:
      graphsVisible = true
      break
    case VIEW_MODE.TABLE:
      tableVisible = true
      break
    case VIEW_MODE.RANKINGS:
      rankingsVisible = true
      break
  }

  return {
    viewMode: viewMode,
    tableVisible: tableVisible,
    rankingsVisible: rankingsVisible,
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
      if (dataEndDate && Object.values(DATE_FILTER).includes(dateFilterMode)) {
        dateFilter.startDate = moment(dataEndDate, DATE_FORMAT_APP)
          .subtract(parseInt(dateFilterMode) - 1, 'days')
          .format(DATE_FORMAT_APP)
      }
      break
  }

  return dateFilter
}

const processDateFilterChange = (startDate, endDate) => {
  const newDateFilterState: Record<string, any> = {}
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
