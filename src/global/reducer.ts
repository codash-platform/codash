import {combineReducers} from 'redux'
import {sidebar} from '../components/sidebar/reducer'
import {graphOverview} from '../pages/dashboard/graphs/reducer'
import {overview} from '../pages/dashboard/reducer'
import {tableOverview} from '../pages/dashboard/tables/reducer'
import {theme} from './themeReducer'

// will hold all reducers and will also be used to hot reload
// in the store via the new hot reloading explicit functionality
const appReducer = combineReducers({
  theme,
  overview,
  tableOverview,
  graphOverview,
  sidebar,
})

// have global actions here
export const rootReducer = (state, action) => {
  return appReducer(state, action)
}
