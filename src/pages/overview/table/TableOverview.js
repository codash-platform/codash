import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {MainLayout} from '../../../components/MainLayout'
import {ACTION_GET_DATA_START, ASYNC_STATUS} from '../../../global/constants'
import {getTableData} from '../../../global/dataParsing'
import {action} from '../../../global/util'
import {MainTable} from './MainTable'

class TableOverviewComponent extends Component {
  componentDidMount() {
    if (!this.props.overview.data) {
      action(ACTION_GET_DATA_START)
    }
  }

  render() {
    const {overview, tableOverview} = this.props
    const {loadingStatus, error, data, dateFilter} = overview
    const {sizePerPage} = tableOverview

    return (
      <MainLayout pageTitle="">
        <Row>
          <Col className="mt-3">
            {loadingStatus === ASYNC_STATUS.FAIL && <Alert variant="danger">{error}</Alert>}
            {loadingStatus === ASYNC_STATUS.PENDING && (
              <Alert variant="info">
                Loading... <FontAwesomeIcon icon={faSpinner} spin={true} />
              </Alert>
            )}
            {loadingStatus === ASYNC_STATUS.SUCCESS && (
              <>
                <Alert variant="info">
                  Loaded data for the {data.startDate} - {data.endDate} date interval.
                </Alert>
                <MainTable data={getTableData(data, dateFilter)} sizePerPage={sizePerPage} />
              </>
            )}
          </Col>
        </Row>
      </MainLayout>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
})

const dispatchToProps = {}

export const TableOverview = connect(stateToProps, dispatchToProps)(withTranslation()(TableOverviewComponent))
