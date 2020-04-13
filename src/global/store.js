/** global: localStorage */
import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {
  ASYNC_STATUS,
  REDUX_STORE_STORAGE_NAME,
  REDUX_STORE_VERSION,
  REDUX_STORE_VERSION_PROPERTY,
  STORAGE_EXPIRY_KEY,
  STORAGE_EXPIRY_TIMEOUT,
} from './constants'
import rootReducer from './reducer'
import {generalSaga} from './sagas'
import {isProduction} from './variables'

// used to store the redux store state in the localStorage on each update
const localStorageMiddleware = ({getState}) => {
  return next => action => {
    const result = next(action)
    const nowTime = new Date().getTime()

    localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(getState()))
    localStorage.setItem(STORAGE_EXPIRY_KEY, nowTime.toString())
    localStorage.setItem(REDUX_STORE_VERSION_PROPERTY, REDUX_STORE_VERSION)

    return result
  }
}

// used to read from localStorage any previously saved redux store state
const reHydrateStore = () => {
  let localData = {}
  const lastUpdatedAt = localStorage.getItem(STORAGE_EXPIRY_KEY)
  const now = new Date().getTime()
  // getTime works in milliseconds so we need to convert the timeout
  const expiryTime = parseInt(lastUpdatedAt, 10) + STORAGE_EXPIRY_TIMEOUT * 60000

  // check for expired or obsolete local storage
  if (
    !lastUpdatedAt
    || expiryTime < now
    || localStorage.getItem(REDUX_STORE_VERSION_PROPERTY) !== REDUX_STORE_VERSION
  ) {
    localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(localData))

    return localData
  }

  const localDataRaw = localStorage.getItem(REDUX_STORE_STORAGE_NAME)

  if (localDataRaw) {
    try {
      localData = JSON.parse(localDataRaw)
    } catch (error) {
      console.warn('Bad redux store data')
      localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(localData))
    }

    // check for valid login status & data
    if (
      localData
      && localData.auth
      && localData.auth.loadingStatus !== ASYNC_STATUS.IDLE
      && localData.auth.loadingStatus !== ASYNC_STATUS.SUCCESS
    ) {
      localData.auth.loadingStatus = ASYNC_STATUS.IDLE
      // localData.auth.token = null
    }
  }

  return localData
}

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// for development enable the redux browser extension
const composeEnhancers =
  !isProduction && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

// mixes the optional redux development extension with other middleware
const enhancer = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    localStorageMiddleware // save the store to localStorage on update
  )
  // other store enhancers if any
)

// create the redux store
const store = createStore(rootReducer, reHydrateStore(), enhancer)

// then run the saga
sagaMiddleware.run(generalSaga)

// enable Webpack hot module replacement for reducers (needed in newer versions)
if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(rootReducer)
  })
}

export default store
