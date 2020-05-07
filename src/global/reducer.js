import {combineReducers} from 'redux'
import {graphOverview} from '../pages/overview/graph/reducer'
import {overview} from '../pages/overview/reducer'
import {tableOverview} from '../pages/overview/table/reducer'
import {theme} from './themeReducer'

// will hold all reducers and will also be used to hot reload
// in the store via the new hot reloading explicit functionality
const appReducer = combineReducers({
  theme,
  overview,
  tableOverview,
  graphOverview,
})

// have global actions here
export const rootReducer = (state, action) => {
  return appReducer(state, action)
}
