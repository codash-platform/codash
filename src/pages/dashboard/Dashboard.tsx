import React, {Component} from 'react'
import {withTranslation, WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {FeatureTour} from '../../components/FeatureTour'
import {ACTION_GET_DATA_START, ACTION_PARSE_URL_PARAMS} from '../../global/constants'
import {action} from '../../global/util'
import {Graphs} from './graphs/Graphs'
import {Tables} from './tables/Tables'

interface DashboardComponentI extends WithTranslation {
  [any: string]: any;
}

class DashboardComponent extends Component<DashboardComponentI> {
  componentDidMount() {
    const {match, overview} = this.props

    if (match?.params) {
      action(ACTION_PARSE_URL_PARAMS, {params: match.params})
    }

    if (!overview.data) {
      action(ACTION_GET_DATA_START)
    }
  }

  render() {
    return (
      <>
        <FeatureTour />
        <Graphs />
        <Tables />
      </>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const Dashboard = connect(stateToProps, dispatchToProps)(withTranslation()(DashboardComponent))
