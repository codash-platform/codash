import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {MainLayout} from '../../components/MainLayout'
import {ACTION_GET_DATA_START, ASYNC_STATUS, VIEW_MODE} from '../../global/constants'
import {getGraphData, getTableData} from '../../global/dataParsing'
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
    const {overview, tableOverview} = this.props
    const {data, dateFilter, selectedGeoIds, viewMode, loadingStatus, error} = overview
    const {sizePerPage} = tableOverview
    const showGraph = [VIEW_MODE.COMBO, VIEW_MODE.GRAPH].includes(viewMode)
    const showTable = [VIEW_MODE.COMBO, VIEW_MODE.TABLE].includes(viewMode)

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
            {!!data && (
              <>
                {showGraph && <Graphs data={getGraphData(data, dateFilter, selectedGeoIds)} />}
                {showTable && <Table data={getTableData(data, dateFilter, selectedGeoIds)} sizePerPage={sizePerPage} />}
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

export const Overview = connect(stateToProps, dispatchToProps)(withTranslation()(OverviewComponent))
