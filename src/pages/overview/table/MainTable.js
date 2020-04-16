import React from 'react'
import {Col, Dropdown, DropdownButton, Row} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import {ACTION_CHANGE_SIZE_PER_PAGE} from '../../../global/constants'
import {action} from '../../../global/util'

export const MainTable = ({data, sizePerPage}) => {
  const {SearchBar} = Search
  const paginationOptions = {
    custom: true,
    page: 1,
    sizePerPage: sizePerPage,
    totalSize: data.length,
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
        text: 'All',
        value: data.length,
      },
    ],
  }
  const hasPredefinedSizePerPage = paginationOptions.sizePerPageList.some(size => parseInt(size.text) === sizePerPage)
  const sizePerPageButtonText = hasPredefinedSizePerPage ? sizePerPage : 'All'

  return (
    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
      {({paginationProps, paginationTableProps}) => (
        <ToolkitProvider keyField="geoId" data={data} columns={columns} bootstrap4 search>
          {({searchProps, baseProps}) => (
            <div id="main-table-container">
              <SearchBar {...searchProps} />
              <BootstrapTable
                noDataIndication={'no table data'}
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
                  <PaginationListStandalone {...paginationProps} />
                </Col>
                <Col xs={3} className="text-right">
                  <PaginationTotalStandalone {...paginationProps} />
                </Col>
              </Row>
            </div>
          )}
        </ToolkitProvider>
      )}
    </PaginationProvider>
  )
}

const perCapitaHeaderFormatter = (column, colIndex, components) => {
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

const perCapitaCellFormatter = cell => {
  if (!cell || isNaN(cell) || !isFinite(cell)) {
    return '--'
  }

  return cell.toLocaleString('de-ch')
}

const percentageHeaderFormatter = (column, colIndex, components) => {
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

const normalHeaderFormatter = (column, colIndex, components) => {
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

const normalCellFormatter = cell => {
  if (!cell) {
    return '--'
  }

  return cell.toLocaleString('de-ch')
}

const columns = [
  {
    dataField: 'name',
    text: 'Country Name',
    headerFormatter: normalHeaderFormatter,
    sort: true,
  },
  {
    dataField: 'cases',
    text: 'Cases',
    sort: true,
    headerFormatter: normalHeaderFormatter,
    formatter: normalCellFormatter,
  },
  {
    dataField: 'deaths',
    text: 'Deaths',
    sort: true,
    headerFormatter: normalHeaderFormatter,
    formatter: normalCellFormatter,
  },
  {
    dataField: 'infectionPerCapita',
    text: 'Incidence Rate',
    sort: true,
    headerFormatter: perCapitaHeaderFormatter,
    formatter: perCapitaCellFormatter,
  },
  {
    dataField: 'mortalityPerCapita',
    text: 'Mortality Rate',
    sort: true,
    headerFormatter: perCapitaHeaderFormatter,
    formatter: perCapitaCellFormatter,
  },
  {
    dataField: 'mortalityPercentage',
    text: 'Case Fatality Ratio',
    sort: true,
    headerFormatter: percentageHeaderFormatter,
    formatter: normalCellFormatter,
  },
  {
    dataField: 'population',
    text: 'Population',
    sort: true,
    headerFormatter: normalHeaderFormatter,
    formatter: normalCellFormatter,
  },
]
