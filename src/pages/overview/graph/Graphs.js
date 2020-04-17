import {ResponsiveBar} from '@nivo/bar'
import {ResponsiveLine} from '@nivo/line'
import React from 'react'

export const Graphs = ({data}) => {
  return (
    <>
      <BarGraph data={data.barData?.data} keys={data.barData?.keys} />
      <LineGraph data={data.lineData} />
    </>
  )
}

export const BarGraph = ({data, keys}) => {
  return (
    <div style={{height: '500px'}}>
      <ResponsiveBar
        data={data || []}
        keys={keys}
        margin={{top: 50, right: 120, bottom: 70, left: 70}}
        groupMode="grouped"
        layout="vertical"
        indexBy="date"
        xScale={{
          type: 'time',
          format: '%d.%m.%Y',
          precision: 'day',
        }}
        xFormat="time:%d.%m.%Y"
        yScale={{
          type: 'linear',
          stacked: false,
        }}
        axisLeft={{
          legend: 'Cases',
          legendOffset: -60,
          legendPosition: 'middle',
          tickSize: 5,
          tickPadding: 3,
          format: value => value.toLocaleString('de-ch'),
        }}
        axisBottom={{
          tickSize: 8,
          tickPadding: 3,
          tickRotation: 30,
        }}
        enableGridY={true}
        enableGridX={false}
        colors={{scheme: 'category10'}}
        borderRadius={1}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1]],
        }}
        enableLabel={false}
        theme={{
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
                  .filter(([name, value]) => name !== 'date')
                  .map(([name, value]) => (
                    <tr key={name}>
                      <td style={{padding: '3px 5px'}}>{name}</td>
                      <td className="font-weight-bold" style={{padding: '3px 5px'}}>
                        {value}
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
  )
}

export const LineGraph = ({data}) => {
  return (
    <div style={{height: '500px'}}>
      <ResponsiveLine
        data={data || []}
        margin={{top: 50, right: 120, bottom: 70, left: 70}}
        xScale={{
          type: 'time',
          format: '%d.%m.%Y',
          precision: 'day',
        }}
        xFormat="time:%d.%m.%Y"
        yScale={{
          type: 'linear',
          stacked: false,
        }}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          legend: 'Cases',
          legendOffset: -60,
          legendPosition: 'middle',
          tickSize: 5,
          tickPadding: 3,
          format: value => value.toLocaleString('de-ch'),
        }}
        axisBottom={{
          format: '%d.%m.%Y',
          legendOffset: 30,
          tickSize: 8,
          tickPadding: 3,
          tickRotation: 30,
        }}
        curve={'monotoneX'}
        colors={{scheme: 'category10'}}
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
              }}
            >
              <div className="font-weight-bold text-center">{slice.points[0].data.xFormatted}</div>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <tbody>
                  {slice.points.map(point => (
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
                      <td className="font-weight-bold" style={{padding: '3px 5px'}}>
                        {point.data.yFormatted}
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
      />
    </div>
  )
}
