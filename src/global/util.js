import {store} from 'global/store'

// general action dispatcher
export const action = (type, params) => store.dispatch({type, ...params})
