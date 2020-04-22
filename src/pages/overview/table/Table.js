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
      dataField: METRICS.CASES,
      textPlaceholder: `table:column_${METRICS.CASES}`,
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
      dataField: METRICS.DEATHS,
      textPlaceholder: `table:column_${METRICS.DEATHS}`,
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
      dataField: METRICS.INFECTION_PER_CAPITA,
      textPlaceholder: `table:column_${METRICS.INFECTION_PER_CAPITA}`,
      unitPlaceholder: 'table:unit_per_capita',
      sort: true,
      formatter: this.perCapitaCellFormatter,
    },
    {
      dataField: METRICS.MORTALITY_PER_CAPITA,
      textPlaceholder: `table:column_${METRICS.MORTALITY_PER_CAPITA}`,
      unitPlaceholder: 'table:unit_per_capita',
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
      dataField: 'population',
      textPlaceholder: 'table:column_population',
      sort: true,
      formatter: this.normalCellFormatter,
    },
  ]

  render() {
    const {overview, tableOverview, t} = this.props
    const {data, dateFilter, selectedGeoIds, tableVisible} = overview
    const {sizePerPage} = tableOverview
    const {SearchBar} = Search

    if (!tableVisible || !data) {
      return null
    }

    const processedData = getTableData(data, dateFilter, selectedGeoIds)
    const paginationOptions = {
      custom: true,
      page: 1,
      sizePerPage: sizePerPage,
      totalSize: processedData.length,
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
          value: processedData.length,
        },
      ],
    }
    const hasPredefinedSizePerPage = paginationOptions.sizePerPageList.some(size => parseInt(size.text) === sizePerPage)
    const sizePerPageButtonText = hasPredefinedSizePerPage ? sizePerPage : t('table:pagination_all')
    this.columns.forEach(columnEntry => {
      columnEntry.text = t(columnEntry?.textPlaceholder)
      columnEntry.headerFormatter = (column, colIndex, components) =>
        this.headerFormatter(column, colIndex, components, t(columnEntry.unitPlaceholder))
    })

    return (
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({paginationProps, paginationTableProps}) => (
          <ToolkitProvider keyField="geoId" data={processedData} columns={this.columns} bootstrap4 search>
            {({searchProps, baseProps}) => (
              <div id="main-table-container">
                <SearchBar {...searchProps} placeholder={t('table:search_placeholder')} />
                <BootstrapTable
                  noDataIndication={t('table:indication_no_data')}
                  hover
                  condensed
                  striped
                  {...paginationTableProps}
                  {...baseProps}
                />
                <Row>
                  <Col xs={3}>
                    <DropdownButton
                      className="react-bs-table-sizePerPage-dropdown"
                      id="pageDropDown"
                      drop={'up'}
                      onSelect={value => action(ACTION_CHANGE_SIZE_PER_PAGE, {sizePerPage: parseInt(value)})}
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
                  <Col xs={6}>
                    <PaginationListStandalone
                      {...paginationProps}
                      prePageTitle={t('table:pagination_previous_page')}
                      nextPageTitle={t('table:pagination_next_page')}
                      firstPageTitle={t('table:pagination_first_page')}
                      lastPageTitle={t('table:pagination_last_page')}
                      alwaysShowAllBtns={true}
                    />
                  </Col>
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
                </Row>
              </div>
            )}
          </ToolkitProvider>
        )}
      </PaginationProvider>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
})

const dispatchToProps = {}

export const Table = connect(stateToProps, dispatchToProps)(withTranslation()(TableComponent))
