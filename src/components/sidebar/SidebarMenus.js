import {faChartBar, faClock, faLayerGroup, faRulerCombined, faTasks} from '@fortawesome/free-solid-svg-icons'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
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
  VIEW_MODE,
} from '../../global/constants'
import {action} from '../../global/util'
import {graphMetricsOrder} from '../../pages/dashboard/graph/Graphs'
import {SidebarMenuSet} from './SidebarMenuSet'

class SidebarMenusComponent extends Component {
  viewModeMenu = {
    labelPlaceholder: 'menu:view_mode_label',
    icon: faLayerGroup,
    activeKeys: [],
    subMenu: Object.values(VIEW_MODE).map(key => ({
      labelPlaceholder: `menu:view_mode_${key}`,
      key: key,
      action: () => action(ACTION_CHANGE_VIEW_MODE, {viewMode: key}),
    })),
  }

  intervalsMenu = {
    labelPlaceholder: 'intervals:button_label',
    icon: faClock,
    activeKeys: [],
    subMenu: Object.values(DATE_FILTER).map(key => ({
      labelPlaceholder: `intervals:${key}`,
      key: key,
      action: () => action(ACTION_CHANGE_DATE_FILTER_MODE, {filterMode: key}),
    })),
  }

  graphModeMenu = {
    labelPlaceholder: 'menu:graph_mode_label',
    icon: faChartBar,
    activeKeys: [],
    subMenu: Object.values(GRAPH_MODE).map(key => ({
      labelPlaceholder: `menu:graph_mode_${key}`,
      key: key,
      action: () => action(ACTION_CHANGE_GRAPH_MODE, {graphMode: key}),
    })),
  }

  graphScaleMenu = {
    labelPlaceholder: 'menu:graph_scale_label',
    icon: faRulerCombined,
    activeKeys: [],
    subMenu: Object.values(GRAPH_SCALE).map(key => ({
      labelPlaceholder: `menu:graph_scale_${key}`,
      key: key,
      action: () => action(ACTION_CHANGE_GRAPH_SCALE, {graphScale: key}),
    })),
  }

  graphMetricsMenu = {
    labelPlaceholder: 'menu:graph_metrics_label',
    icon: faTasks,
    activeKeys: [],
    subMenu: ['all', 'none', ...graphMetricsOrder].map(key => ({
      labelPlaceholder: `menu:metrics_${key}`,
      key: key,
      action: () => action(ACTION_CHANGE_METRIC_GRAPH_VISIBILITY, {metric: key}),
    })),
  }

  render() {
    const {t} = this.props

    this.intervalsMenu.activeKeys = [this.props.overview.dateFilter.mode]
    this.viewModeMenu.activeKeys = [this.props.overview.viewMode]
    this.graphModeMenu.activeKeys = [this.props.graphOverview.graphMode]
    this.graphScaleMenu.activeKeys = [this.props.graphOverview.graphScale]
    this.graphMetricsMenu.activeKeys = [...this.props.graphOverview.metricsVisible]

    return (
      <>
        <div className="sidebar-menu vertical-nav-menu">
          <ul className="sidebar-menu-container">
            <h5 className="app-sidebar__heading">{t('sidebar:header_time')}</h5>
            <SidebarMenuSet menuData={this.intervalsMenu} />

            <h5 className="app-sidebar__heading">{t('sidebar:header_view')}</h5>
            <SidebarMenuSet menuData={this.viewModeMenu} />

            <h5 className="app-sidebar__heading">{t('sidebar:header_graph')}</h5>
            <SidebarMenuSet menuData={this.graphMetricsMenu} />
            <SidebarMenuSet menuData={this.graphModeMenu} />
            <SidebarMenuSet menuData={this.graphScaleMenu} />
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
