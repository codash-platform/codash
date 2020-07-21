import React, {Component} from 'react'
import {Col, Form, Row} from 'react-bootstrap'
import {withTranslation, WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {ACTION_CHANGE_GEOID_SELECTION, LOCALE_DEFAULT, METRIC, TABLE_TYPE} from '../../../global/constants'
import {getTableData} from '../../../global/dataParsing'
import {action} from '../../../global/util'
import {colors} from '../graphs/Graphs'
import {CustomTable} from './CustomTable'
import {ColumnEntry, Overview, TableOverview} from '../../../global/typeUtils'
import {ColumnDescription} from 'react-bootstrap-table-next'
import {InfoHover} from '../../../components/InfoHover'

interface TableComponentProps extends WithTranslation {
  overview: Overview;
  tableOverview: TableOverview;
}

export type CustomHeaderFormatter<T extends object = any> = (
  column: ColumnDescription<T>,
  colIndex: number,
  components: {
    sortElement: React.ReactNode;
    filterElement: React.ReactNode;
  },
  infoPlaceholder?: string
) => React.ReactNode

class TableComponent extends Component<TableComponentProps> {
  perCapitaCellFormatter = cell => {
    if (!cell || isNaN(cell) || !isFinite(cell)) {
      return '--'
    }

    return cell.toLocaleString(LOCALE_DEFAULT)
  }

  headerFormatter: CustomHeaderFormatter = (column, colIndex, components, infoPlaceholder) => {
    return (
      <>
        <div>{column.text}</div>
        <div>
          {infoPlaceholder && <InfoHover messagePlaceholder={infoPlaceholder} className="mr-2 text-codash-primary" />}
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

  columns: ColumnEntry[] = [
    {
      dataField: 'selected',
      textPlaceholder: 'table:column_selected',
      infoPlaceholder: 'table:column_info_selected',
      sort: true,
      headerStyle: {width: '90px'},
      style: {textAlign: 'center'},
      formatter: (cell, row) => {
        if (!row) {
          return
        }

        return (
          <Form.Check
            custom
            type="checkbox"
            id={`select-${row.geoId}`}
            value={row.geoId}
            label=""
            disabled={!cell && row.maxSelectionReached}
            onChange={e =>
              action(ACTION_CHANGE_GEOID_SELECTION, {
                geoId: e.target.value,
                selected: e.target.checked,
              })
            }
            checked={cell}
          />
        )
      },
    },
    {
      dataField: 'name',
      textPlaceholder: 'table:column_name',
      sort: true,
    },
    {
      dataField: METRIC.CASES_NEW,
      textPlaceholder: `general:metrics_${METRIC.CASES_NEW}`,
      infoPlaceholder: `table:metric_info_${METRIC.CASES_NEW}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRIC.CASES_ACCUMULATED,
      textPlaceholder: `general:metrics_${METRIC.CASES_ACCUMULATED}`,
      infoPlaceholder: `table:metric_info_${METRIC.CASES_ACCUMULATED}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRIC.CASES_PER_CAPITA,
      textPlaceholder: `general:metrics_${METRIC.CASES_PER_CAPITA}`,
      infoPlaceholder: `table:metric_info_${METRIC.CASES_PER_CAPITA}`,
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRIC.CASES_PER_CAPITA_ACCUMULATED,
      textPlaceholder: `general:metrics_${METRIC.CASES_PER_CAPITA_ACCUMULATED}`,
      infoPlaceholder: `table:metric_info_${METRIC.CASES_PER_CAPITA_ACCUMULATED}`,
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRIC.DEATHS_NEW,
      textPlaceholder: `general:metrics_${METRIC.DEATHS_NEW}`,
      infoPlaceholder: `table:metric_info_${METRIC.DEATHS_NEW}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRIC.DEATHS_ACCUMULATED,
      textPlaceholder: `general:metrics_${METRIC.DEATHS_ACCUMULATED}`,
      infoPlaceholder: `table:metric_info_${METRIC.DEATHS_ACCUMULATED}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRIC.DEATHS_PER_CAPITA,
      textPlaceholder: `general:metrics_${METRIC.DEATHS_PER_CAPITA}`,
      infoPlaceholder: `table:metric_info_${METRIC.DEATHS_PER_CAPITA}`,
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRIC.DEATHS_PER_CAPITA_ACCUMULATED,
      textPlaceholder: `general:metrics_${METRIC.DEATHS_PER_CAPITA_ACCUMULATED}`,
      infoPlaceholder: `table:metric_info_${METRIC.DEATHS_PER_CAPITA_ACCUMULATED}`,
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRIC.MORTALITY_PERCENTAGE,
      textPlaceholder: `general:metrics_${METRIC.MORTALITY_PERCENTAGE}`,
      infoPlaceholder: `table:metric_info_${METRIC.MORTALITY_PERCENTAGE}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: METRIC.MORTALITY_PERCENTAGE_ACCUMULATED,
      textPlaceholder: `general:metrics_${METRIC.MORTALITY_PERCENTAGE_ACCUMULATED}`,
      infoPlaceholder: `table:metric_info_${METRIC.MORTALITY_PERCENTAGE_ACCUMULATED}`,
      sort: true,
      formatter: this.normalCellFormatter,
    },
    {
      dataField: 'population',
      textPlaceholder: 'table:column_population',
      infoPlaceholder: 'table:metric_info_population',
      sort: true,
      formatter: this.normalCellFormatter,
    },
  ]

  render() {
    const {overview, tableOverview, t} = this.props
    const {data, dateFilter, selectedGeoIds, tableVisible, rankingsVisible} = overview

    if (!data || !dateFilter.startDate || !dateFilter.endDate || (!tableVisible && !rankingsVisible)) {
      return null
    }

    const maxSelectionReached = Object.values(selectedGeoIds).filter(value => value).length >= colors.length
    const processedData = getTableData(data, dateFilter, selectedGeoIds, maxSelectionReached)

    return (
      <>
        <Row>
          {Object.values(TABLE_TYPE).map((tableType: string) => {
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
              const geoIdData = processedData.filter(entry => entry.geoId !== 'WW')

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
