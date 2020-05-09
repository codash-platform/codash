import axios from 'axios'
import {call, put, select, takeLatest} from 'redux-saga/effects'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_GRAPH_SCALE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_CLEAR_NOTIFICATION,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_SET_NOTIFICATION,
  ROUTE_DASHBOARD,
  URL_ELEMENT_SEPARATOR,
} from './constants'
import {history} from './store'

const routingActions = [
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_GRAPH_SCALE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
]

function* getData(action) {
  try {
    yield put({type: ACTION_SET_NOTIFICATION, message: 'global:notification_loading', showSpinner: true})
    const result = yield call(
      axios.get,
      'https://cors-anywhere.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/casedistribution/json'
    )
    yield put({type: ACTION_GET_DATA_SUCCESS, result: result.data})
    yield put({type: ACTION_CLEAR_NOTIFICATION})
  } catch (e) {
    console.error(e)
    yield put({type: ACTION_GET_DATA_FAIL, error: e.message})
  }
}

function* changeUrl() {
  const urlParams = yield select(state => {
    const result = {
      viewMode: state.overview?.viewMode || '',
      startDate: state.overview?.dateFilter?.startDate || '',
      endDate: state.overview?.dateFilter?.endDate || '',
      graphMode: state.graphOverview?.graphMode || '',
      graphScale: state.graphOverview?.graphScale || '',
      metricsVisible: state.graphOverview?.metricsVisible?.join(URL_ELEMENT_SEPARATOR) || '',
    }

    if (state.overview?.selectedGeoIds) {
      result.selectedGeoIds = Object.entries(state.overview.selectedGeoIds)
        .filter(([geoId, active]) => active)
        .map(([geoId, active]) => geoId)
        .sort()
        .join(URL_ELEMENT_SEPARATOR)
    } else {
      result.selectedGeoIds = ''
    }

    if (state.overview?.dateFilter?.mode) {
      result.startDate = state.overview.dateFilter.mode
      result.endDate = state.overview.dateFilter.mode
    }

    return result
  })

  const route = Object.entries(urlParams).reduce(
    (parsedRoute, [paramName, paramValue]) => parsedRoute.replace(`:${paramName}?`, paramValue),
    ROUTE_DASHBOARD
  )

  if (history.location.pathname !== route) {
    history.push(route)
  }
}

export function* generalSaga() {
  yield takeLatest(ACTION_GET_DATA_START, getData)
  yield takeLatest(routingActions, changeUrl)
}
