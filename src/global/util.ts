import {store} from './store'

// general action dispatcher
export const action = (type: string, params?: Record<string, any>) => store.dispatch({type, ...params})
