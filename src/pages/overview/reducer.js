import moment from 'moment'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_HEADER_MESSAGE_CLEAR,
  ACTION_HEADER_MESSAGE_SET,
  ACTION_REPARSE_DATA,
  ASYNC_STATUS,
  DATE_FILTER,
  DATE_FORMAT_APP,
  VIEW_MODE,
} from '../../global/constants'
import {parseRawData} from '../../global/dataParsing'

const initialState = {
  error: null,
  loadingStatus: ASYNC_STATUS.IDLE,
  headerMessage: null,
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

const preselectedGeoIds = ['WW', 'US', 'CN', 'DE', 'FR', 'ES', 'IT', 'CH']

export const overview = (state = initialState, action = {}) => {
  // noinspection FallThroughInSwitchStatementJS
  switch (action.type) {
    case ACTION_HEADER_MESSAGE_SET:
      return {
        ...state,
        headerMessage: action.message,
      }

    case ACTION_HEADER_MESSAGE_CLEAR:
      return {
        ...state,
        headerMessage: null,
      }

    case ACTION_GET_DATA_START:
      return {
        ...initialState,
        loadingStatus: ASYNC_STATUS.PENDING,
      }

    case ACTION_REPARSE_DATA:
      if (!state.data?.rawData) {
        return {
          ...state,
          error: 'no data loaded',
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
          error: 'invalid api data',
        }
      }

      let selectedGeoIds = {}
      if (parsedData.geoIds) {
        parsedData.geoIds.map(geoId => {
          selectedGeoIds[geoId] = preselectedGeoIds.includes(geoId)
        })
      }

      return {
        ...state,
        error: null,
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
          mode: DATE_FILTER.LAST14DAYS,
        },
        selectedGeoIds: selectedGeoIds,
      }

    case ACTION_GET_DATA_FAIL:
      return {
        ...state,
        error: action.error,
        loadingStatus: ASYNC_STATUS.FAIL,
      }

    case ACTION_CHANGE_DATE_FILTER_MODE:
      const dateFilter = {
        ...state.dateFilter,
        startDate: state.data?.startDate,
        endDate: state.data?.endDate,
        mode: action.mode,
      }

      switch (action.mode) {
        default:
        case DATE_FILTER.TOTAL:
          break
        case DATE_FILTER.LAST7DAYS:
          if (state.data?.endDate) {
            dateFilter.startDate = moment(state.data.endDate, DATE_FORMAT_APP)
              .subtract(7, 'days')
              .format(DATE_FORMAT_APP)
          }
          break
        case DATE_FILTER.LAST14DAYS:
          if (state.data?.endDate) {
            dateFilter.startDate = moment(state.data.endDate, DATE_FORMAT_APP)
              .subtract(14, 'days')
              .format(DATE_FORMAT_APP)
          }
          break
        case DATE_FILTER.LAST30DAYS:
          if (state.data?.endDate) {
            dateFilter.startDate = moment(state.data.endDate, DATE_FORMAT_APP)
              .subtract(30, 'days')
              .format(DATE_FORMAT_APP)
          }
          break
        case DATE_FILTER.SINGLE_DAY:
        case DATE_FILTER.CUSTOM_INTERVAL:
          dateFilter.startDate = action.startDate
          dateFilter.endDate = action.endDate
          break
      }

      return {
        ...state,
        dateFilter,
      }

    case ACTION_CHANGE_DATE_FILTER_INTERVAL:
      let newState = {...state}

      if (action.startDate) {
        newState.dateFilter.startDate = action.startDate
      }
      if (action.endDate) {
        newState.dateFilter.startDate = action.endDate
      }

      return newState

    case ACTION_CHANGE_GEOID_SELECTION:
      const newSelectedGeoIds = {...state.selectedGeoIds}
      newSelectedGeoIds[action.geoId] = action.selected

      return {
        ...state,
        selectedGeoIds: newSelectedGeoIds,
      }

    case ACTION_CHANGE_VIEW_MODE:
      let tableVisible = true
      let graphsVisible = true
      switch (action.viewMode) {
        default:
        case VIEW_MODE.COMBO:
          break
        case VIEW_MODE.GRAPH:
          tableVisible = false
          break
        case VIEW_MODE.TABLE:
          graphsVisible = false
          break
      }

      return {
        ...state,
        viewMode: action.viewMode,
        tableVisible: tableVisible,
        graphsVisible: graphsVisible,
      }

    default:
      return state
  }
}
