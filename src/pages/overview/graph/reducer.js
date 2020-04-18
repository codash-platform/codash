import {ACTION_CHANGE_GRAPH_MODE, GRAPH_MODE} from '../../../global/constants'

const initialState = {
  graphMode: GRAPH_MODE.LINE,
  lineGraphVisible: true,
  barGraphVisible: false,
}

export const graphOverview = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_CHANGE_GRAPH_MODE:
      let lineGraphVisible = true
      let barGraphVisible = false

      switch (action.graphMode) {
        default:
        case GRAPH_MODE.LINE:
          break
        case GRAPH_MODE.COMBO:
          barGraphVisible = true
          break
        case GRAPH_MODE.BAR:
          lineGraphVisible = false
          barGraphVisible = true
          break
      }
      return {
        ...state,
        graphMode: action.graphMode,
        lineGraphVisible: lineGraphVisible,
        barGraphVisible: barGraphVisible,
      }

    default:
      return state
  }
}
