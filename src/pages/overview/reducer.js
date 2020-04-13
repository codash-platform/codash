import {
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_HEADER_MESSAGE_CLEAR,
  ACTION_HEADER_MESSAGE_SET,
  ACTION_REPARSE_DATA,
  ASYNC_STATUS,
} from '../../global/constants'
import {parseRawData} from '../../global/dataParsing'

const initialState = {
  error: null,
  loadingStatus: ASYNC_STATUS.IDLE,
  headerMessage: null,
  data: null,
  lastDay: null,
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
        data: parseRawData(action.result.records),
        loadingStatus: ASYNC_STATUS.SUCCESS,
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
        data: parseRawData(state.data.rawData),
      }

    default:
      return state
  }
}
