import axios from 'axios'
import {call, put, takeLatest} from 'redux-saga/effects'
import {
  ACTION_CLEAR_NOTIFICATION,
  ACTION_GET_DATA_FAIL,
  ACTION_GET_DATA_START,
  ACTION_GET_DATA_SUCCESS,
  ACTION_SET_NOTIFICATION,
} from './constants'

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

export function* generalSaga() {
  yield takeLatest(ACTION_GET_DATA_START, getData)
}
