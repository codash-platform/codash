import {
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_GRAPH_SCALE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
  ACTION_PARSE_URL_PARAMS,
  GRAPH_MODE,
  GRAPH_SCALE,
  METRICS,
  URL_ELEMENT_SEPARATOR,
} from '../../../global/constants'
import {graphMetricsOrder} from './Graphs'

const initialState = {
  graphMode: GRAPH_MODE.LINE,
  graphScale: GRAPH_SCALE.LINEAR,
  lineGraphVisible: true,
  barGraphVisible: false,
  metricsVisible: Object.values(METRICS),
}

export const graphOverview = (state = initialState, action: Record<string,any> = {}) => {
  switch (action.type) {
    case ACTION_CHANGE_GRAPH_MODE:
      return {
        ...state,
        ...processGraphMode(action.graphMode),
      }

    case ACTION_CHANGE_GRAPH_SCALE:
      return {
        ...state,
        graphScale: action.graphScale,
      }

    case ACTION_CHANGE_METRIC_GRAPH_VISIBILITY: {
      let newMetricsVisible

      switch (action.metric) {
        default:
          newMetricsVisible = new Set([...state.metricsVisible])

          if (newMetricsVisible.has(action.metric)) {
            newMetricsVisible.delete(action.metric)
          } else {
            newMetricsVisible.add(action.metric)
          }
          break
        case 'all':
          newMetricsVisible = graphMetricsOrder
          break
        case 'none':
          newMetricsVisible = []
          break
      }

      return {
        ...state,
        metricsVisible: [...newMetricsVisible],
      }
    }

    case ACTION_PARSE_URL_PARAMS:
      let newStateParams = {...state}
      const {params} = action

      if (Object.values(GRAPH_MODE).includes(params.graphMode)) {
        newStateParams = {
          ...newStateParams,
          ...processGraphMode(params.graphMode),
        }
      }

      if (Object.values(GRAPH_SCALE).includes(params.graphScale)) {
        newStateParams = {
          ...newStateParams,
          graphScale: params.graphScale,
        }
      }

      if (params.metricsVisible) {
        const metrics = params.metricsVisible
          .split(URL_ELEMENT_SEPARATOR)
          .filter(metric => Object.values(METRICS).includes(metric))

        newStateParams = {
          ...newStateParams,
          metricsVisible: metrics,
        }
      }

      return newStateParams

    default:
      return state
  }
}

const processGraphMode = graphMode => {
  let lineGraphVisible = true
  let barGraphVisible = false

  switch (graphMode) {
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
    graphMode: graphMode,
    lineGraphVisible: lineGraphVisible,
    barGraphVisible: barGraphVisible,
  }
}
