import React, {Component} from 'react'
import {withTranslation, WithTranslation} from 'react-i18next'
import Joyride, {EVENTS, STATUS} from 'react-joyride'
import {connect} from 'react-redux'
import {
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
  ACTION_CHANGE_TOUR_COMPLETION,
  ACTION_CHANGE_TOUR_STATE,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_EXPAND_ONLY_SIDEBAR_MENU,
  ACTION_TOGGLE_DATE_FILTER,
  ACTION_TOGGLE_SIDEBAR_MENU,
  SIDEBAR_MENUS,
  VIEW_MODE,
} from '../global/constants'
import {action} from '../global/util'

const tourStepOrder = {
  dateFilter: 0,
  quickInterval: 1,
  countrySelection: 2,
  viewMode: 3,
  graphMode: 4,
  graphMetrics: 5,
  graphScale: 6,
  tourButton: 7,
}

const steps = [
  {
    target: '.DateRangePicker_1',
    contentPlaceholder: 'tour:step_date_filter',
    spotlightClicks: false,
    placement: 'bottom',
  },
  {
    target: '[data-feature-tour="quick-interval"]',
    contentPlaceholder: 'tour:step_quick_interval',
    placement: 'right',
  },
  {
    target: '.table-container tbody td:first-child',
    contentPlaceholder: 'tour:step_country_selection',
  },
  {
    target: '[data-feature-tour="view-mode"]',
    contentPlaceholder: 'tour:step_view_mode',
    placement: 'right',
  },
  {
    target: '[data-feature-tour="graph-mode"]',
    contentPlaceholder: 'tour:step_graph_mode',
    placement: 'right',
  },
  {
    target: '[data-feature-tour="graph-metrics"]',
    contentPlaceholder: 'tour:step_graph_metrics',
    placement: 'right',
  },
  {
    target: '[data-feature-tour="graph-scale"]',
    contentPlaceholder: 'tour:step_graph_scale',
    placement: 'right',
  },
  {
    target: '.tour-button',
    contentPlaceholder: 'tour:step_tour_button',
    placement: 'bottom',
  },
]

interface FeatureTourComponentI extends WithTranslation {
  [any: string]: any;
}

class FeatureTourComponent extends Component<FeatureTourComponentI> {
  render() {
    const {overview, t} = this.props
    const {tourEnabled} = overview

    const translatedSteps = steps.map((step: Record<string, any>) => {
      step.content = t(step.contentPlaceholder)
      return step
    })

    return (
      <Joyride
        run={tourEnabled}
        disableOverlayClose={true}
        //@ts-ignore
        steps={translatedSteps}
        showSkipButton={true}
        locale={{
          back: t('tour:button_back'),
          close: t('tour:button_close'),
          last: t('tour:button_last'),
          next: t('tour:button_next'),
          skip: t('tour:button_skip'),
        }}
        callback={(data: Record<string, any>) => {
          if (data.type === EVENTS.BEACON) {
            switch (data.index) {
              case tourStepOrder.dateFilter:
                action(ACTION_CHANGE_METRIC_GRAPH_VISIBILITY, {metric: 'all'})
                action(ACTION_TOGGLE_DATE_FILTER, {focusedInput: null})
                break

              case tourStepOrder.quickInterval:
                action(ACTION_CHANGE_VIEW_MODE, {viewMode: VIEW_MODE.TABLE})
                action(ACTION_EXPAND_ONLY_SIDEBAR_MENU, {menuId: SIDEBAR_MENUS.INTERVALS_MENU})
                break

              case tourStepOrder.countrySelection:
                action(ACTION_TOGGLE_SIDEBAR_MENU, {
                  menuId: SIDEBAR_MENUS.VIEW_MODE_MENU,
                  expanded: false,
                })
                break

              case tourStepOrder.viewMode:
                action(ACTION_CHANGE_VIEW_MODE, {viewMode: VIEW_MODE.TABLE})
                action(ACTION_EXPAND_ONLY_SIDEBAR_MENU, {menuId: SIDEBAR_MENUS.VIEW_MODE_MENU})
                break

              case tourStepOrder.graphMode:
                action(ACTION_CHANGE_VIEW_MODE, {viewMode: VIEW_MODE.GRAPHS})
                action(ACTION_EXPAND_ONLY_SIDEBAR_MENU, {menuId: SIDEBAR_MENUS.GRAPH_MODE_MENU})
                break

              case tourStepOrder.graphMetrics:
                action(ACTION_EXPAND_ONLY_SIDEBAR_MENU, {menuId: SIDEBAR_MENUS.GRAPH_METRICS_MENU})
                break

              case tourStepOrder.graphScale:
                action(ACTION_EXPAND_ONLY_SIDEBAR_MENU, {menuId: SIDEBAR_MENUS.GRAPH_SCALE_MENU})
                break
            }
          }

          // Need to set our running state to false, so we can restart if we click start again.
          if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
            action(ACTION_CHANGE_TOUR_STATE, {enabled: false})
            action(ACTION_CHANGE_TOUR_COMPLETION, {completed: true})
          }
        }}
      />
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const FeatureTour = connect(stateToProps, dispatchToProps)(withTranslation()(FeatureTourComponent))
