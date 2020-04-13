import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import {withTranslation} from 'react-i18next'
import {MainLayout} from '../../../components/MainLayout'
import {ACTION_GET_DATA_START, ASYNC_STATUS} from '../../../global/constants'
import {action} from '../../../global/util'
import {connect} from 'react-redux'

class TableOverviewComponent extends Component {
  perCapitaHeaderFormatter = (column, colIndex, components) => {
    return (
      <>
        <div>{column.text}</div>
        <div>
          (per million)
          {components.sortElement}
          {components.filterElement}
        </div>
      </>
    )
  }

  perCapitaCellFormatter = cell => {
    if (!cell || isNaN(cell) || !isFinite(cell)) {
      return '--'
    }

    return cell.toLocaleString('de-ch')
  }

  percentageHeaderFormatter = (column, colIndex, components) => {
    return (
      <>
        <div>{column.text}</div>
        <div>
          (%)
          {components.sortElement}
          {components.filterElement}
        </div>
      </>
    )
  }

  normalHeaderFormatter = (column, colIndex, components) => {
    return (
      <>
        <div>{column.text}</div>
        <div>
          {components.sortElement}
          {components.filterElement}
        </div>
      </>
    )
  }
  normalCellFormatter = cell => {
    if (!cell) {
      return '--'
    }

    return cell.toLocaleString('de-ch')
  }

  columns = [
    {
      dataField: 'name',
      text: 'Country Name',
      headerFormatter: this.normalHeaderFormatter,
      sort: true,
    },
    {
      dataField: 'cases',
      text: 'Cases',
      sort: true,
      headerFormatter: this.normalHeaderFormatter,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: 'deaths',
      text: 'Deaths',
      sort: true,
      headerFormatter: this.normalHeaderFormatter,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: 'infectionPerCapita',
      text: 'Incidence Rate',
      sort: true,
      headerFormatter: this.perCapitaHeaderFormatter,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: 'mortalityPerCapita',
      text: 'Mortality Rate',
      sort: true,
      headerFormatter: this.perCapitaHeaderFormatter,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: 'mortalityPercentage',
      text: 'Case Fatality Ratio',
      sort: true,
      headerFormatter: this.percentageHeaderFormatter,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: 'population',
      text: 'Population',
      sort: true,
      headerFormatter: this.normalHeaderFormatter,
      formatter: this.normalCellFormatter,
    },
  ]

  componentDidMount() {
    if (!this.props.overview.data) {
      action(ACTION_GET_DATA_START)
    }
  }

  renderTable() {
    const {data} = this.props.overview
    const {dataSource, selectedDay} = this.props.tableOverview
    const {SearchBar} = Search
    let tableData = data[dataSource] || null

    if (dataSource === 'total') {
      if (!tableData) {
        return <p>no data</p>
      }
    } else {
      tableData = data.perDayData[selectedDay] || null
      if (!tableData) {
        return <p>no data</p>
      }
    }

    return (
      <ToolkitProvider keyField="name" data={tableData} columns={this.columns} bootstrap4 search>
        {props => (
          <div>
            <SearchBar {...props.searchProps} />
            <BootstrapTable noDataIndication={'no table data'} hover condensed striped {...props.baseProps} />
          </div>
        )}
      </ToolkitProvider>
    )
  }

  render() {
    const {t, overview, tableOverview} = this.props
    const {loadingStatus, error, data} = overview
    const {dataSource, selectedDay} = tableOverview
    const isDayMode = dataSource === 'day'

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
                  Most recent date {data.mostRecentDay}. {isDayMode && selectedDay && `Loaded date ${selectedDay}`}
                </Alert>
                {this.renderTable()}
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
