import {ACTION_EXPAND_ONLY_SIDEBAR_MENU, ACTION_TOGGLE_SIDEBAR_MENU, SIDEBAR_MENUS} from '../../global/constants'
import {SidebarAction} from '../../global/typeUtils'

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
  [SIDEBAR_MENUS.FILTERS_CONTINENT_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.FILTERS_POPULATION_MENU]: {
    expanded: false,
  },
  [SIDEBAR_MENUS.INTERVALS_MENU]: {
    expanded: false,
  },
}

export const sidebar = (state: typeof initialState = initialState, action: SidebarAction = {}) => {
  switch (action.type) {
    case ACTION_TOGGLE_SIDEBAR_MENU:
      return {
        ...state,
        [action.menuId]: {
          ...state[action.menuId],
          expanded: action.expanded,
        },
      }

    case ACTION_EXPAND_ONLY_SIDEBAR_MENU:
      const newState = {...state}
      Object.values(SIDEBAR_MENUS).map(menuId => {
        newState[menuId].expanded = false
      })

      newState[action.menuId].expanded = true

      return newState

    default:
      return state
  }
}
