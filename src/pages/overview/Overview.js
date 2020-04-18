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
    const {overview, tableOverview, graphOverview} = this.props
    const {data, dateFilter, selectedGeoIds, tableVisible, graphsVisible, loadingStatus, error} = overview
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
            {!!data && (
              <>
                {graphsVisible && (
                  <Graphs
                    data={data}
                    dateFilter={dateFilter}
                    selectedGeoIds={selectedGeoIds}
                    lineGraphVisible={graphOverview.lineGraphVisible}
                    barGraphVisible={graphOverview.barGraphVisible}
                  />
                )}
                {tableVisible && (
                  <Table
                    data={data}
                    dateFilter={dateFilter}
                    selectedGeoIds={selectedGeoIds}
                    sizePerPage={sizePerPage}
                  />
                )}
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
  graphOverview: state.graphOverview,
})

const dispatchToProps = {}

export const Overview = connect(stateToProps, dispatchToProps)(withTranslation()(OverviewComponent))
