import {
  ACTION_TOGGLE_SIDEBAR,
  ACTION_ENABLE_FIXED_FOOTER,
  ACTION_ENABLE_FIXED_HEADER,
  ACTION_ENABLE_FIXED_SIDEBAR,
  ACTION_ENABLE_HEADER_SHADOW,
  ACTION_ENABLE_MOBILE_MENU,
  ACTION_ENABLE_MOBILE_MENU_SMALL,
  ACTION_ENABLE_PAGE_TABS_ALT,
  ACTION_ENABLE_PAGE_TITLE_ICON,
  ACTION_ENABLE_PAGE_TITLE_SUBHEADING,
  ACTION_ENABLE_SIDEBAR_SHADOW,
  ACTION_SET_BACKGROUND_COLOR,
  ACTION_SET_COLOR_SCHEME,
  ACTION_SET_HEADER_BACKGROUND_COLOR,
} from './constants'

const initialState = {
  backgroundColor: 'bg-codash-secondary sidebar-text-light',
  headerBackgroundColor: 'bg-codash-primary header-text-light',
  enableMobileMenuSmall: '',
  closedSidebar: false,
  enableFixedHeader: true,
  enableHeaderShadow: true,
  enableSidebarShadow: true,
  enableFixedFooter: true,
  enableFixedSidebar: true,
  colorScheme: 'white',
  enablePageTitleIcon: true,
  enablePageTitleSubheading: true,
  enablePageTabsAlt: false,
}

export function theme(state = initialState, action) {
  switch (action.type) {
    case ACTION_ENABLE_FIXED_HEADER:
      return {
        ...state,
        enableFixedHeader: action.enableFixedHeader,
      }

    case ACTION_ENABLE_HEADER_SHADOW:
      return {
        ...state,
        enableHeaderShadow: action.enableHeaderShadow,
      }

    case ACTION_ENABLE_SIDEBAR_SHADOW:
      return {
        ...state,
        enableSidebarShadow: action.enableSidebarShadow,
      }

    case ACTION_ENABLE_PAGE_TITLE_ICON:
      return {
        ...state,
        enablePageTitleIcon: action.enablePageTitleIcon,
      }

    case ACTION_ENABLE_PAGE_TITLE_SUBHEADING:
      return {
        ...state,
        enablePageTitleSubheading: action.enablePageTitleSubheading,
      }

    case ACTION_ENABLE_PAGE_TABS_ALT:
      return {
        ...state,
        enablePageTabsAlt: action.enablePageTabsAlt,
      }

    case ACTION_ENABLE_FIXED_SIDEBAR:
      return {
        ...state,
        enableFixedSidebar: action.enableFixedSidebar,
      }

    case ACTION_ENABLE_MOBILE_MENU:
      return {
        ...state,
        enableMobileMenu: action.enableMobileMenu,
      }

    case ACTION_ENABLE_MOBILE_MENU_SMALL:
      return {
        ...state,
        enableMobileMenuSmall: action.enableMobileMenuSmall,
      }

    case ACTION_TOGGLE_SIDEBAR:
      return {
        ...state,
        closedSidebar: action.closedSidebar,
      }

    case ACTION_ENABLE_FIXED_FOOTER:
      return {
        ...state,
        enableFixedFooter: action.enableFixedFooter,
      }

    case ACTION_SET_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColor: action.backgroundColor,
      }

    case ACTION_SET_HEADER_BACKGROUND_COLOR:
      return {
        ...state,
        headerBackgroundColor: action.headerBackgroundColor,
      }

    case ACTION_SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.colorScheme,
      }
  }
  return state
}
