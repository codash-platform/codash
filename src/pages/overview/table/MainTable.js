import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'

export const MainTable = ({data}) => {
  const {SearchBar} = Search

  return (
    <ToolkitProvider keyField="geoId" data={data} columns={columns} bootstrap4 search>
      {props => (
        <div>
          <SearchBar {...props.searchProps} />
          <BootstrapTable noDataIndication={'no table data'} hover condensed striped {...props.baseProps} />
        </div>
      )}
    </ToolkitProvider>
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
