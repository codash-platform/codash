import {AnyAction} from 'redux'
import {store} from './store'

// general action dispatcher
export const action = (type: string, params?: Record<string, unknown>): AnyAction => store.dispatch({type, ...params})
