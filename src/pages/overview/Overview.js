import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {ACTION_GET_DATA_START, ACTION_PARSE_URL_PARAMS} from '../../global/constants'
import {action} from '../../global/util'
import {Graphs} from './graph/Graphs'
import {Table} from './table/Table'

class OverviewComponent extends Component {
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
        <Graphs />
        <Table />
      </>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const Overview = connect(stateToProps, dispatchToProps)(withTranslation()(OverviewComponent))
