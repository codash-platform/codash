import React from 'react'
import {Card, Col, Dropdown, DropdownButton, Row} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'
import {ACTION_CHANGE_SIZE_PER_PAGE} from '../../../global/constants'
import {action} from '../../../global/util'

export const CustomTable = ({
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
    <Card className="mb-3">
      <Card.Body>
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
      </Card.Body>
    </Card>
  )
}
