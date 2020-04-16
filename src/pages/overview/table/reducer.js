import {
  ACTION_CHANGE_DATA_SOURCE,
  ACTION_CHANGE_SELECTED_DAY,
  ACTION_CHANGE_SIZE_PER_PAGE,
  TABLE_MODES,
} from '../../../global/constants'

const initialState = {
  selectedDay: null,
  tableMode: TABLE_MODES.TOTAL,
  sizePerPage: 50,
}

export const tableOverview = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_CHANGE_DATA_SOURCE:
      let newState = {
        ...state,
        tableMode: action.tableMode,
      }

      if (!!action.day) {
        newState.selectedDay = action.day
      }

      return newState

    case ACTION_CHANGE_SELECTED_DAY:
      return {
        ...state,
        selectedDay: action.selectedDay,
      }

    case ACTION_CHANGE_SIZE_PER_PAGE:
      return {
        ...state,
        sizePerPage: action.sizePerPage,
      }

    default:
      return state
  }
}
