import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {MainLayout} from '../../components/MainLayout'
import {ACTION_GET_DATA_START} from '../../global/constants'
import {action} from '../../global/util'
import {Graphs} from './graph/Graphs'
import {Table} from './table/Table'

class OverviewComponent extends Component {
  componentDidMount() {
    if (!this.props.overview.data) {
      action(ACTION_GET_DATA_START)
    }
  }

  render() {
    return (
      <MainLayout>
        <>
          <Graphs />
          <Table />
        </>
      </MainLayout>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const Overview = connect(stateToProps, dispatchToProps)(withTranslation()(OverviewComponent))
