import React, {Component} from 'react'
import {Col, Dropdown, DropdownButton, Form, Row} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {
  ACTION_CHANGE_GEOID_SELECTION,
  ACTION_CHANGE_SIZE_PER_PAGE,
  LOCALE_DEFAULT,
  METRICS,
  TABLE_TYPE,
} from '../../../global/constants'
import {getTableData} from '../../../global/dataParsing'
import {action} from '../../../global/util'

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
      headerStyle: {width: '60px'},
      style: {textAlign: 'center'},
      formatter: (cell, row) => (
        <Form.Check
          custom
          type="checkbox"
          id={`select-${row.geoId}`}
          value={row.geoId}
          label=""
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
    const {data, dateFilter, selectedGeoIds, tableVisible} = overview

    if (!tableVisible || !data) {
      return null
    }

    // todo make sure total date data is supplied to table tops
    const processedData = getTableData(data, dateFilter, selectedGeoIds)
    const geoIdData = processedData.filter(entry => entry.geoId !== 'WW')

    return (
      <>
        <Row>
          {Object.values(TABLE_TYPE).map(tableType => {
            if (tableType === TABLE_TYPE.MAIN) {
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

const CustomTable = ({
  sizePerPage,
  count,
  t,
  data,
  columns,
  headerFormatter,
  tableType,
  defaultSorted,
  smallPagination,
}) => {
  const {SearchBar} = Search

  const paginationOptions = {
    custom: true,
    page: 1,
    sizePerPage: sizePerPage,
    totalSize: count,
    sizePerPageList: [
      {
        text: '10',
        value: 10,
      },
      {
        text: '25',
        value: 25,
      },
      {
        text: '50',
        value: 50,
      },
      {
        text: '100',
        value: 100,
      },
      {
        text: t('table:pagination_all'),
        value: count,
      },
    ],
  }
  const hasPredefinedSizePerPage = paginationOptions.sizePerPageList.some(size => parseInt(size.text) === sizePerPage)
  const sizePerPageButtonText = hasPredefinedSizePerPage ? sizePerPage : t('table:pagination_all')
  columns.forEach(columnEntry => {
    columnEntry.text = t(columnEntry?.textPlaceholder)
    columnEntry.headerFormatter = (column, colIndex, components) =>
      headerFormatter(column, colIndex, components, t(columnEntry.unitPlaceholder))
  })

  return (
    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
      {({paginationProps, paginationTableProps}) => (
        <ToolkitProvider keyField="geoId" data={data} columns={columns} bootstrap4 search>
          {({searchProps, baseProps}) => (
            <div className="table-container">
              <SearchBar {...searchProps} placeholder={t('table:search_placeholder')} tableId={tableType} />
              <BootstrapTable
                noDataIndication={t('table:indication_no_data')}
                hover
                condensed
                striped
                defaultSorted={defaultSorted && [{dataField: defaultSorted, order: 'desc'}]}
                {...paginationTableProps}
                {...baseProps}
              />
              <Row>
                <Col xs={3}>
                  <DropdownButton
                    className="react-bs-table-sizePerPage-dropdown"
                    id={`pageDropDown${tableType}`}
                    drop={'up'}
                    onSelect={value =>
                      action(ACTION_CHANGE_SIZE_PER_PAGE, {sizePerPage: parseInt(value), tableType: tableType})
                    }
                    variant="secondary"
                    title={sizePerPageButtonText}
                  >
                    {paginationProps.sizePerPageList.map(size => (
                      <Dropdown.Item key={size.value} eventKey={size.value}>
                        {size.text}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col xs={smallPagination ? 9 : 6}>
                  <PaginationListStandalone
                    {...paginationProps}
                    prePageTitle={t('table:pagination_previous_page')}
                    nextPageTitle={t('table:pagination_next_page')}
                    firstPageTitle={t('table:pagination_first_page')}
                    lastPageTitle={t('table:pagination_last_page')}
                    alwaysShowAllBtns={!smallPagination}
                  />
                </Col>
                {!smallPagination && (
                  <Col xs={3} className="text-right">
                    <PaginationTotalStandalone
                      {...paginationProps}
                      paginationTotalRenderer={(from, to, dataSize) => (
                        <span className="react-bootstrap-table-pagination-total">
                          {t('table:pagination_total', {from: from, to: to, dataSize: dataSize})}
                        </span>
                      )}
                    />
                  </Col>
                )}
              </Row>
            </div>
          )}
        </ToolkitProvider>
      )}
    </PaginationProvider>
  )
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
})

const dispatchToProps = {}

export const Table = connect(stateToProps, dispatchToProps)(withTranslation()(TableComponent))
