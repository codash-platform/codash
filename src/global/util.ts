import {store} from './store'

// general action dispatcher
export const action = (type, params?: any) => store.dispatch({type, ...params})
