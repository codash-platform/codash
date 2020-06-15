import {Bar} from '@nivo/bar'
import {Line} from '@nivo/line'
import {Scale} from '@nivo/scales'
import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {withTranslation, WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import {GRAPH_SCALE, LOCALE_DEFAULT, METRICS} from '../../../global/constants'
import {getGraphData} from '../../../global/dataParsing'
import {GraphOverviewT, Overview} from '../../../global/typeUtils'

export const graphMetricsOrder = [
  METRICS.CASES_NEW,
  METRICS.CASES_PER_CAPITA,
  METRICS.CASES_ACCUMULATED,
  METRICS.CASES_PER_CAPITA_ACCUMULATED,
  METRICS.DEATHS_NEW,
  METRICS.DEATHS_PER_CAPITA,
  METRICS.DEATHS_ACCUMULATED,
  METRICS.DEATHS_PER_CAPITA_ACCUMULATED,
  METRICS.MORTALITY_PERCENTAGE,
  METRICS.MORTALITY_PERCENTAGE_ACCUMULATED,
]

export const colors = [
  '#1f78b4',
  '#cab2d6',
  '#ff7f00',
  '#33a02c',
  '#fdbf6f',
  '#e31a1c',
  '#a6cee3',
  '#6a3d9a',
  '#fb9a99',
  '#b2df8a',
  '#b15928',
  '#ffff99',
]

interface GraphsComponentProps extends WithTranslation {
  overview: Overview
  graphOverview: GraphOverviewT
}

class GraphsComponent extends Component<GraphsComponentProps> {
  getColorForDataSet = databject => {
    const {selectedGeoIds, data} = this.props.overview

    if (!selectedGeoIds || !data?.geoIdToNameMapping) {
      return colors[0]
    }

    const geoIdList = Object.entries(selectedGeoIds)
      .filter(([key, value]) => value)
      .map(([key, value]) => key)
      .sort()

    let dataGeoId = databject.geoId
    if (!dataGeoId) {
      if (databject.data?.nameToGeoId?.[databject.id]) {
        dataGeoId = databject.data.nameToGeoId[databject.id]
      } else {
        return colors[0]
      }
    }

    let geoIdIndex = geoIdList.indexOf(dataGeoId)
    if (geoIdIndex < 0) {
      geoIdIndex = 0
    }
    const colorIndex = geoIdIndex % colors.length

    return colors[colorIndex]
  }

  getColorForTooltip = dataGeoId => {
    const {selectedGeoIds, data} = this.props.overview
    if (!selectedGeoIds || !data?.geoIdToNameMapping) {
      return colors[0]
    }

    const geoIdList = Object.entries(selectedGeoIds)
      .filter(([key, value]) => value)
      .map(([key, value]) => key)
      .sort()

    let geoIdIndex = geoIdList.indexOf(dataGeoId)
    if (geoIdIndex < 0) {
      geoIdIndex = 0
    }
    const colorIndex = geoIdIndex % colors.length

    return colors[colorIndex]
  }

  render() {
    const {overview, graphOverview, t} = this.props
    const {data, dateFilter, selectedGeoIds, graphsVisible} = overview
    const {lineGraphVisible, barGraphVisible, metricsVisible, graphScale} = graphOverview
    const graphs = []

    if (!graphsVisible || !data || !dateFilter.startDate || !dateFilter.endDate) {
      return graphs
    }

    // disable animations when too much data causes UI lagging
    const animationsEnabled =
      metricsVisible.length < 5 && Object.values(selectedGeoIds).filter(selected => selected).length < 5

    graphMetricsOrder
      .filter(metric => metricsVisible.includes(metric))
      .map(metricName => {
        const metricLabel = t(`graph:metrics_${metricName}`)
        const processedData: Record<string, any> = getGraphData(
          data,
          dateFilter,
          selectedGeoIds,
          metricName,
          lineGraphVisible,
          barGraphVisible,
          graphScale,
        )

        if (lineGraphVisible) {
          graphs.push(
            <Card key={`line-${metricName}`} className="mb-3">
              <Card.Header>{metricLabel}</Card.Header>
              <LineGraph
                data={processedData.lineData}
                scale={graphScale}
                logarithmParams={processedData.logarithmParams}
                getColorForDataSet={this.getColorForDataSet}
                animationsEnabled={animationsEnabled}
              />
            </Card>,
          )
        }

        if (barGraphVisible) {
          graphs.push(
            <Card key={`bar-${metricName}`} className="mb-3">
              <Card.Header>{metricLabel}</Card.Header>
              <Card.Body>
                <BarGraph
                  data={processedData.barData?.data}
                  keys={processedData.barData?.keys}
                  getColorForDataSet={this.getColorForDataSet}
                  getColorForTooltip={this.getColorForTooltip}
                  animationsEnabled={animationsEnabled}
                />
              </Card.Body>
            </Card>,
          )
        }
      })

    return graphs
  }
}

export const BarGraph = ({data, keys, getColorForDataSet, getColorForTooltip, animationsEnabled}) => {
  const xScale: Scale = {
    type: 'time',
    format: '%d.%m.%Y',
    precision: 'day',
    useUTC: false,
  }
  return (
    <AutoSizer disableHeight>
      {({width}) => (
        <div style={{width: width + 'px'}}>
          <Bar
            height={500}
            width={width}
            data={data || []}
            keys={keys}
            animate={animationsEnabled}
            margin={{top: 50, right: 120, bottom: 70, left: 70}}
            groupMode="grouped"
            layout="vertical"
            indexBy="date"
            // @ts-ignore
            xScale={xScale}
            xFormat="time:%d.%m.%Y"
            yScale={{
              type: 'linear',
              stacked: false,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 3,
              format: value => value.toLocaleString(LOCALE_DEFAULT),
            }}
            axisBottom={{
              tickSize: 8,
              tickPadding: 3,
              tickRotation: 30,
            }}
            enableGridY={true}
            enableGridX={false}
            colors={getColorForDataSet}
            borderRadius={1}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1]],
            }}
            enableLabel={false}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: '16px',
                  },
                },
              },
              tooltip: {
                container: {
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '2px',
                },
              },
            }}
            tooltip={data => (
              <>
                <div className="font-weight-bold text-center">{data.indexValue}</div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <tbody>
                  {Object.entries(data.data)
                    .filter(([name, value]) => !['date', 'nameToGeoId'].includes(name))
                    .sort((a, b) => (b?.[1] as any) - (a?.[1] as any))
                    .map(([name, value]) => (
                      <tr key={name}>
                        <td style={{padding: '3px 5px'}}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: getColorForTooltip(data.data.nameToGeoId[name]),
                            }}
                          />
                        </td>
                        <td style={{padding: '3px 5px'}}>{name}</td>
                        <td className="font-weight-bold text-right" style={{padding: '3px 5px'}}>
                          {value.toLocaleString(LOCALE_DEFAULT)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'square',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
              },
            ]}
          />
        </div>
      )}
    </AutoSizer>
  )
}

export const LineGraph = ({data, scale, logarithmParams, getColorForDataSet, animationsEnabled}) => {
  let yScaleConfig: Scale = {
    type: 'linear',
    stacked: false,
  }
  let leftAxisFormatter = value => value.toLocaleString(LOCALE_DEFAULT)

  if (scale === GRAPH_SCALE.LOGARITHMIC) {
    const LogYScale: Scale = {
      type: 'log',
      base: 10,
      min: logarithmParams.min || 'auto',
      max: logarithmParams.max || 'auto',
    }
    yScaleConfig = {
      ...yScaleConfig,
      ...LogYScale,
    }

    // show the axis ticks for every power of 10
    leftAxisFormatter = value => {
      if (Math.log10(value) % 1 !== 0) {
        return ''
      }

      return value.toLocaleString(LOCALE_DEFAULT)
    }
  }

  return (
    <AutoSizer disableHeight>
      {({width}) => (
        <div style={{width: width + 'px'}}>
          <Line
            data={data || []}
            height={500}
            width={width}
            animate={animationsEnabled}
            margin={{top: 10, right: 120, bottom: 70, left: 70}}
            xScale={{
              type: 'time',
              format: '%d.%m.%Y',
              precision: 'day',
              useUTC: false,
            }}
            xFormat="time:%d.%m.%Y"
            yScale={yScaleConfig}
            axisRight={null}
            axisLeft={{
              tickSize: 5,
              tickPadding: 3,
              format: leftAxisFormatter,
            }}
            axisBottom={{
              format: '%d.%m.%Y',
              legendOffset: 30,
              tickSize: 8,
              tickPadding: 3,
              tickRotation: 30,
            }}
            curve={'monotoneX'}
            colors={getColorForDataSet}
            lineWidth={2}
            pointSize={4}
            pointColor={'white'}
            pointBorderWidth={2}
            pointBorderColor={{
              from: 'serieColor',
            }}
            enableSlices={'x'}
            sliceTooltip={({slice}) => {
              return (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '5px 9px',
                    borderRadius: '2px',
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
                  }}
                >
                  <div className="font-weight-bold text-center">{slice.points[0].data.xFormatted}</div>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <tbody>
                    {slice.points
                      .sort((a, b) => (b?.data?.yFormatted as any) - (a?.data?.yFormatted as any))
                      .map(point => (
                        <tr key={point.id}>
                          <td style={{padding: '3px 5px'}}>
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: point.serieColor,
                              }}
                            />
                          </td>
                          <td style={{padding: '3px 5px'}}>{point.serieId}</td>
                          <td className="font-weight-bold text-right" style={{padding: '3px 5px'}}>
                            {point.data.yFormatted.toLocaleString(LOCALE_DEFAULT)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
              },
            ]}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: '16px',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </AutoSizer>
  )
}

const stateToProps = state => ({
  overview: state.overview,
  graphOverview: state.graphOverview,
})

const dispatchToProps = {}

export const Graphs = connect(stateToProps, dispatchToProps)(withTranslation()(GraphsComponent))
