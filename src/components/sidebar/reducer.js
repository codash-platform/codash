import {ACTION_TOGGLE_SIDEBAR_MENU, SIDEBAR_MENUS} from '../../global/constants'

const initialState = {
  [SIDEBAR_MENUS.GRAPH_SCALE_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.GRAPH_MODE_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.GRAPH_METRICS_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.VIEW_MODE_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.INTERVALS_MENU]: {
    expanded: false,
  },
}

export const sidebar = (state = initialState, action = {}) => {
  switch (action.type) {
    case ACTION_TOGGLE_SIDEBAR_MENU:
      return {
        ...state,
        [action.menuId]: {
          ...state[action.menuId],
          expanded: action.expanded,
        },
      }

    default:
      return state
  }
}
