import {combineReducers} from 'redux'
import {overview} from '../pages/overview/reducer'
import {tableOverview} from '../pages/overview/table/reducer'

// will hold all reducers and will also be used to hot reload
// in the store via the new hot reloading explicit functionality
const appReducer = combineReducers({
  overview,
  tableOverview,
})

// have global actions here
const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
