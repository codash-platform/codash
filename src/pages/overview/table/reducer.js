import {ACTION_CHANGE_DATA_SOURCE, ACTION_CHANGE_SELECTED_DAY, TABLE_MODES} from '../../../global/constants'

const initialState = {
  selectedDay: null,
  tableMode: TABLE_MODES.TOTAL,
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

    default:
      return state
  }
}
