import {ACTION_CHANGE_SIZE_PER_PAGE, TABLE_TYPE} from '../../../global/constants'

const initialState = {
  [TABLE_TYPE.MAIN]: {
    sizePerPage: 25,
  },
  [TABLE_TYPE.CASES_NEW]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.CASES_ACCUMULATED]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.CASES_PER_CAPITA]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.CASES_PER_CAPITA_ACCUMULATED]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.DEATHS_NEW]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.DEATHS_ACCUMULATED]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.DEATHS_PER_CAPITA]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.DEATHS_PER_CAPITA_ACCUMULATED]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.MORTALITY_PERCENTAGE]: {
    sizePerPage: 10,
  },
  [TABLE_TYPE.MORTALITY_PERCENTAGE_ACCUMULATED]: {
    sizePerPage: 10,
  },
}

export const tableOverview = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_CHANGE_SIZE_PER_PAGE:
      if (!Object.values(TABLE_TYPE).includes(action.tableType)) {
        return state
      }

      return {
        ...state,
        [action.tableType]: {
          ...state[action.tableType],
          sizePerPage: action.sizePerPage,
        },
      }

    default:
      return state
  }
}
