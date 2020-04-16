import moment from 'moment'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_HEADER_MESSAGE_CLEAR,
  ACTION_HEADER_MESSAGE_SET,
  ACTION_REPARSE_DATA,
  ASYNC_STATUS,
  DATE_FILTER,
  DATE_FORMAT_APP,
} from '../../global/constants'
import {parseRawData} from '../../global/dataParsing'

const initialState = {
  error: null,
  loadingStatus: ASYNC_STATUS.IDLE,
  headerMessage: null,
  data: null,
  endDate: null,
  dateFilter: {
    startDate: null,
    endDate: null,
    mode: DATE_FILTER.TOTAL,
  },
}

export const overview = (state = initialState, action = {}) => {
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

    case ACTION_GET_DATA_SUCCESS:
      return {
        ...state,
        error: null,
        loadingStatus: ASYNC_STATUS.SUCCESS,
        data: {
          ...parseRawData(action.result.records),
        },
      }

    case ACTION_GET_DATA_FAIL:
      return {
        ...state,
        error: action.error,
        loadingStatus: ASYNC_STATUS.FAIL,
      }

    case ACTION_REPARSE_DATA:
      return {
        ...state,
        data: {
          ...parseRawData(state.data.rawData),
        },
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
          if (state.data?.startDate) {
            dateFilter.startDate = moment(state.data.endDate, DATE_FORMAT_APP)
              .subtract(7, 'days')
              .format(DATE_FORMAT_APP)
          }
          break
        case DATE_FILTER.LAST14DAYS:
          if (state.data?.startDate) {
            dateFilter.startDate = moment(state.data.endDate, DATE_FORMAT_APP)
              .subtract(14, 'days')
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

    default:
      return state
  }
}
