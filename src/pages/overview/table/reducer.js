import {ACTION_CHANGE_SIZE_PER_PAGE} from '../../../global/constants'

const initialState = {
  sizePerPage: 50,
}

export const tableOverview = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_CHANGE_SIZE_PER_PAGE:
      return {
        ...state,
        sizePerPage: action.sizePerPage,
      }

    default:
      return state
  }
}
