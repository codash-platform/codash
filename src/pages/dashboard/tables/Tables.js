import React, {Component} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {ACTION_CHANGE_GEOID_SELECTION, LOCALE_DEFAULT, METRICS, TABLE_TYPE} from '../../../global/constants'
import {getTableData} from '../../../global/dataParsing'
import {action} from '../../../global/util'
import {colors} from '../graphs/Graphs'
import {CustomTable} from './CustomTable'

class TableComponent extends Component {
  perCapitaCellFormatter = cell => {
    if (!cell || isNaN(cell) || !isFinite(cell)) {
      return '--'
    }

    return cell.toLocaleString(LOCALE_DEFAULT)
  }

  headerFormatter = (column, colIndex, components, subHeader) => {
    return (
      <>
        <div>{column.text}</div>
        <div>
          {subHeader}
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

    return cell.toLocaleString(LOCALE_DEFAULT)
  }

  columns = [
    {
      dataField: 'selected',
      textPlaceholder: 'table:column_selected',
      sort: true,
      headerStyle: {width: '90px'},
      style: {textAlign: 'center'},
      formatter: (cell, row) => (
        <Form.Check
          custom
          type="checkbox"
          id={`select-${row.geoId}`}
          value={row.geoId}
          label=""
          disabled={!cell && row.maxSelectionReached}
          onChange={e => action(ACTION_CHANGE_GEOID_SELECTION, {geoId: e.target.value, selected: e.target.checked})}
          checked={cell}
        />
      ),
    },
    {
      dataField: 'name',
      textPlaceholder: 'table:column_name',
      sort: true,
    },
    {
      dataField: METRICS.CASES_NEW,
      textPlaceholder: `table:column_${METRICS.CASES_NEW}`,
      unitPlaceholder: 'table:unit_period',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRICS.CASES_ACCUMULATED,
      textPlaceholder: `table:column_${METRICS.CASES_ACCUMULATED}`,
      unitPlaceholder: 'table:unit_cumulated',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRICS.CASES_PER_CAPITA,
      textPlaceholder: `table:column_${METRICS.CASES_PER_CAPITA}`,
      unitPlaceholder: 'table:unit_per_capita',
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRICS.CASES_PER_CAPITA_ACCUMULATED,
      textPlaceholder: `table:column_${METRICS.CASES_PER_CAPITA_ACCUMULATED}`,
      unitPlaceholder: 'table:unit_per_capita_accumulated',
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRICS.DEATHS_NEW,
      textPlaceholder: `table:column_${METRICS.DEATHS_NEW}`,
      unitPlaceholder: 'table:unit_period',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRICS.DEATHS_ACCUMULATED,
      textPlaceholder: `table:column_${METRICS.DEATHS_ACCUMULATED}`,
      unitPlaceholder: 'table:unit_cumulated',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRICS.DEATHS_PER_CAPITA,
      textPlaceholder: `table:column_${METRICS.DEATHS_PER_CAPITA}`,
      unitPlaceholder: 'table:unit_per_capita',
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRICS.DEATHS_PER_CAPITA_ACCUMULATED,
      textPlaceholder: `table:column_${METRICS.DEATHS_PER_CAPITA_ACCUMULATED}`,
      unitPlaceholder: 'table:unit_per_capita_accumulated',
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRICS.MORTALITY_PERCENTAGE,
      textPlaceholder: `table:column_${METRICS.MORTALITY_PERCENTAGE}`,
      unitPlaceholder: 'table:unit_percentage',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRICS.MORTALITY_PERCENTAGE_ACCUMULATED,
      textPlaceholder: `table:column_${METRICS.MORTALITY_PERCENTAGE_ACCUMULATED}`,
      unitPlaceholder: 'table:unit_percentage_accumulated',
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: 'population',
      textPlaceholder: 'table:column_population',
      sort: true,
      formatter: this.normalCellFormatter,
    },
  ]

  render() {
    const {overview, tableOverview, t} = this.props
    const {data, dateFilter, selectedGeoIds, tableVisible, rankingsVisible} = overview

    if (!data || (!tableVisible && !rankingsVisible)) {
      return null
    }

    const maxSelectionReached = Object.values(selectedGeoIds).filter(value => value).length >= colors.length
    const processedData = getTableData(data, dateFilter, selectedGeoIds, maxSelectionReached)
    const geoIdData = processedData.filter(entry => entry.geoId !== 'WW')

    return (
      <>
        <Row>
          {Object.values(TABLE_TYPE).map(tableType => {
            if (tableType === TABLE_TYPE.MAIN) {
              if (!tableVisible) {
                return
              }

              return (
                <Col key={tableType} xs={12}>
                  <CustomTable
                    t={t}
                    sizePerPage={tableOverview[tableType].sizePerPage}
                    data={processedData}
                    count={processedData.length}
                    columns={this.columns}
                    headerFormatter={this.headerFormatter}
                    tableType={tableType}
                  />
                </Col>
              )
            } else {
              if (!rankingsVisible) {
                return
              }

              return (
                <Col key={tableType} lg={6} xs={12}>
                  <CustomTable
                    t={t}
                    sizePerPage={tableOverview[tableType].sizePerPage}
                    data={geoIdData}
                    count={geoIdData.length}
                    columns={this.columns.filter(column => ['selected', 'name', tableType].includes(column.dataField))}
                    headerFormatter={this.headerFormatter}
                    tableType={tableType}
                    defaultSorted={tableType}
                    smallPagination={true}
                  />
                </Col>
              )
            }
          })}
        </Row>
      </>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
})

const dispatchToProps = {}

export const Tables = connect(stateToProps, dispatchToProps)(withTranslation()(TableComponent))
