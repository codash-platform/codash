import {createBrowserHistory} from 'history'
import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {
  REDUX_STORE_STORAGE_NAME,
  REDUX_STORE_VERSION,
  REDUX_STORE_VERSION_PROPERTY,
  STORAGE_EXPIRY_KEY,
  STORAGE_EXPIRY_TIMEOUT,
} from './constants'
import {rootReducer} from './reducer'
import {generalSaga} from './sagas'
import {isProduction} from './variables'

// used to store the redux store state in the localStorage on each update
const localStorageMiddleware = ({getState}) => {
  return next => action => {
    const result = next(action)
    const nowTime = new Date().getTime()
    const state = getState()
    const newState = {}

    // skip data objects since they take too much space/processing
    for (let [key, value] of Object.entries(state)) {
      const newReducer = {}
      for (let [subKey, subValue] of Object.entries(value)) {
        if (subKey === 'data' && key === 'overview' && subValue) {
          continue
        }
        newReducer[subKey] = subValue
      }
      newState[key] = newReducer
    }

    localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(newState))
    localStorage.setItem(STORAGE_EXPIRY_KEY, nowTime.toString())
    localStorage.setItem(REDUX_STORE_VERSION_PROPERTY, REDUX_STORE_VERSION)

    return result
  }
}

// used to read from localStorage any previously saved redux store state
const reHydrateStore = () => {
  let localData: Record<string, any> = {}
  const lastUpdatedAt = localStorage.getItem(STORAGE_EXPIRY_KEY)
  const now = new Date().getTime()
  // getTime works in milliseconds so we need to convert the timeout
  const expiryTime = parseInt(lastUpdatedAt, 10) + STORAGE_EXPIRY_TIMEOUT * 60000

  // check for expired or obsolete local storage
  if (!lastUpdatedAt || localStorage.getItem(REDUX_STORE_VERSION_PROPERTY) !== REDUX_STORE_VERSION) {
    localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(localData))

    return localData
  }

  const localDataRaw = localStorage.getItem(REDUX_STORE_STORAGE_NAME)

  if (localDataRaw) {
    try {
      localData = JSON.parse(localDataRaw)
      if (expiryTime < now && localData.overview?.data) {
        localData.overview.data = null
      }
    } catch (error) {
      console.warn('Bad redux store data')
      localStorage.setItem(REDUX_STORE_STORAGE_NAME, JSON.stringify(localData))
    }
  }

  return localData
}

export const history = createBrowserHistory()

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// for development enable the redux browser extension
const composeEnhancers =
  !isProduction && typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose
// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...

// mixes the optional redux development extension with other middleware
const enhancer = composeEnhancers(
  applyMiddleware(
    sagaMiddleware,
    localStorageMiddleware // save the store to localStorage on update
  )
  // other store enhancers if any
)

// create the redux store
export const store = createStore(rootReducer, reHydrateStore(), enhancer)

// then run the saga
sagaMiddleware.run(generalSaga)

// enable Webpack hot module replacement for reducers (needed in newer versions)
declare const module: any
if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(rootReducer)
  })
}
