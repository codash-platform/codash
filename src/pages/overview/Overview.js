import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {MainLayout} from '../../components/MainLayout'
import {ACTION_GET_DATA_START, ASYNC_STATUS} from '../../global/constants'
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
    const {overview, t} = this.props
    const {loadingStatus, error} = overview

    return (
      <MainLayout pageTitle="">
        <Row>
          <Col className="mt-3">
            {loadingStatus === ASYNC_STATUS.FAIL && <Alert variant="danger">{error}</Alert>}
            {loadingStatus === ASYNC_STATUS.PENDING && (
              <Alert variant="info">
                {t('global:loading')}
                <FontAwesomeIcon icon={faSpinner} spin={true} />
              </Alert>
            )}
            <Graphs />
            <Table />
          </Col>
        </Row>
      </MainLayout>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const Overview = connect(stateToProps, dispatchToProps)(withTranslation()(OverviewComponent))
