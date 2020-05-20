import {
  faAddressCard,
  faChartBar,
  faClock,
  faLayerGroup,
  faRulerCombined,
  faTasks,
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {withTranslation, WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_GRAPH_SCALE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
  ACTION_CHANGE_VIEW_MODE,
  DATE_FILTER,
  GRAPH_MODE,
  GRAPH_SCALE,
  SIDEBAR_MENUS,
  VIEW_MODE,
} from '../../global/constants'
import {action} from '../../global/util'
import {graphMetricsOrder} from '../../pages/dashboard/graphs/Graphs'
import {SidebarMenuSet} from './SidebarMenuSet'

interface SidebarMenusComponentI extends WithTranslation {
  [any: string]: any
}

class SidebarMenusComponent extends Component<SidebarMenusComponentI> {
  menus = [
    {
      id: SIDEBAR_MENUS.VIEW_MODE_MENU,
      labelPlaceholder: 'menu:view_mode_label',
      icon: faLayerGroup,
      activeKeys: [],
      subMenu: Object.values(VIEW_MODE).map(key => ({
        labelPlaceholder: `menu:view_mode_${key}`,
        key: key,
        action: () => action(ACTION_CHANGE_VIEW_MODE, {viewMode: key}),
      })),
      extraProps: {
        'data-feature-tour': 'view-mode',
      },
    },
    {
      id: SIDEBAR_MENUS.INTERVALS_MENU,
      labelPlaceholder: 'intervals:button_label',
      icon: faClock,
      activeKeys: [],
      subMenu: Object.values(DATE_FILTER).map(key => ({
        labelPlaceholder: `intervals:${key}`,
        key: key,
        action: () => action(ACTION_CHANGE_DATE_FILTER_MODE, {filterMode: key}),
      })),
      extraProps: {
        'data-feature-tour': 'quick-interval',
      },
    },
    {
      id: SIDEBAR_MENUS.GRAPH_MODE_MENU,
      labelPlaceholder: 'menu:graph_mode_label',
      icon: faChartBar,
      activeKeys: [],
      subMenu: Object.values(GRAPH_MODE).map(key => ({
        labelPlaceholder: `menu:graph_mode_${key}`,
        key: key,
        action: () => action(ACTION_CHANGE_GRAPH_MODE, {graphMode: key}),
      })),
      extraProps: {
        'data-feature-tour': 'graph-mode',
      },
    },
    {
      id: SIDEBAR_MENUS.GRAPH_SCALE_MENU,
      labelPlaceholder: 'menu:graph_scale_label',
      icon: faRulerCombined,
      activeKeys: [],
      subMenu: Object.values(GRAPH_SCALE).map(key => ({
        labelPlaceholder: `menu:graph_scale_${key}`,
        key: key,
        action: () => action(ACTION_CHANGE_GRAPH_SCALE, {graphScale: key}),
      })),
      extraProps: {
        'data-feature-tour': 'graph-scale',
      },
    },
    {
      id: SIDEBAR_MENUS.GRAPH_METRICS_MENU,
      labelPlaceholder: 'menu:graph_metrics_label',
      icon: faTasks,
      activeKeys: [],
      subMenu: ['all', 'none', ...graphMetricsOrder].map(key => ({
        labelPlaceholder: `general:metrics_${key}`,
        key: key,
        action: () => action(ACTION_CHANGE_METRIC_GRAPH_VISIBILITY, {metric: key}),
      })),
      extraProps: {
        'data-feature-tour': 'graph-metrics',
      },
    },
  ]

  getActiveKeysForMenu(menuId) {
    const {graphOverview, overview} = this.props

    switch (menuId) {
      case SIDEBAR_MENUS.INTERVALS_MENU:
        return [overview.dateFilter.mode]
      case SIDEBAR_MENUS.VIEW_MODE_MENU:
        return [overview.viewMode]
      case SIDEBAR_MENUS.GRAPH_SCALE_MENU:
        return [graphOverview.graphScale]
      case SIDEBAR_MENUS.GRAPH_MODE_MENU:
        return [graphOverview.graphMode]
      case SIDEBAR_MENUS.GRAPH_METRICS_MENU:
        return [...graphOverview.metricsVisible]
    }
  }

  render() {
    const {t} = this.props

    const intervalsMenu = this.menus.find(menuData => menuData.id === SIDEBAR_MENUS.INTERVALS_MENU)
    const viewModeMenu = this.menus.find(menuData => menuData.id === SIDEBAR_MENUS.VIEW_MODE_MENU)
    const graphModeMenu = this.menus.find(menuData => menuData.id === SIDEBAR_MENUS.GRAPH_MODE_MENU)
    const graphScaleMenu = this.menus.find(menuData => menuData.id === SIDEBAR_MENUS.GRAPH_SCALE_MENU)
    const graphMetricsMenu = this.menus.find(menuData => menuData.id === SIDEBAR_MENUS.GRAPH_METRICS_MENU)

    return (
      <>
        <div className="sidebar-menu vertical-nav-menu">
          <ul className="sidebar-menu-container">
            <h5 className="app-sidebar__heading">{t('sidebar:header_time')}</h5>
            <SidebarMenuSet menuData={intervalsMenu} activeKeys={this.getActiveKeysForMenu(intervalsMenu.id)} />

            <h5 className="app-sidebar__heading">{t('sidebar:header_view')}</h5>
            <SidebarMenuSet menuData={viewModeMenu} activeKeys={this.getActiveKeysForMenu(viewModeMenu.id)} />

            <h5 className="app-sidebar__heading">{t('sidebar:header_graph')}</h5>
            <SidebarMenuSet menuData={graphMetricsMenu} activeKeys={this.getActiveKeysForMenu(graphMetricsMenu.id)} />
            <SidebarMenuSet menuData={graphModeMenu} activeKeys={this.getActiveKeysForMenu(graphModeMenu.id)} />
            <SidebarMenuSet menuData={graphScaleMenu} activeKeys={this.getActiveKeysForMenu(graphScaleMenu.id)} />

            <h5 className="app-sidebar__heading">{t('sidebar:header_project')}</h5>
            <li className="sidebar-menu-item">
              <a className="sidebar-menu-link" target="_blank" href="https://github.com/codash-platform/codash">
                <FontAwesomeIcon className="sidebar-menu-icon" icon={faAddressCard} />
                {t('sidebar:menu_about')}
              </a>
            </li>
          </ul>
        </div>
      </>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  graphOverview: state.graphOverview,
})

const dispatchToProps = {}

export const SidebarMenus = connect(stateToProps, dispatchToProps)(withTranslation()(SidebarMenusComponent))
