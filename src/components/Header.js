import classNames from 'classnames'
import React from 'react'
import {Alert, Button, ButtonGroup, Col, Container, Form, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  ACTION_CHANGE_DATE_FILTER_INTERVAL,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_GET_DATA_START,
  ACTION_HEADER_MESSAGE_CLEAR,
  ACTION_REPARSE_DATA,
  DATE_FILTER,
  GRAPH_MODE,
  VIEW_MODE,
} from '../global/constants'
import {action} from '../global/util'
import {appName, isProduction} from '../global/variables'

const MenuButton = props => {
  let className = props.className || 'mx-1'
  const variant = props.variant || 'light'
  if (props.active) {
    className += ' text-primary'
  }

  return (
    <Button size="sm" className={className} variant={variant} onClick={props.action}>
      {props.title}
    </Button>
  )
}

class HeaderComponent extends React.Component {
  render() {
    const {message, overview, graphOverview} = this.props
    const {dateFilter, graphsVisible} = overview

    return (
      <div id="header">
        <Container fluid>
          <Row>
            <Col lg={3} xs={4}>
              <h2 className="m-0 text-light">{appName}</h2>
            </Col>
            <Col>
              <MenuButton variant="dark" action={() => action(ACTION_GET_DATA_START)} title="Reload Data" />
              {!isProduction && (
                <MenuButton variant="dark" action={() => action(ACTION_REPARSE_DATA)} title="Reparse" />
              )}
              <ButtonGroup className="my-1">
                {Object.keys(VIEW_MODE).map((viewMode, index) => (
                  <MenuButton
                    className={classNames({
                      'ml-1': index === 0,
                      'mr-1': index === Object.keys(VIEW_MODE).length - 1,
                      'border-left': index !== 0,
                    })}
                    key={viewMode}
                    active={overview.viewMode === viewMode}
                    action={() => action(ACTION_CHANGE_VIEW_MODE, {viewMode: viewMode})}
                    title={viewMode.charAt(0) + viewMode.slice(1).toLowerCase()}
                  />
                ))}
              </ButtonGroup>
              {graphsVisible && (
                <ButtonGroup className="my-1">
                  {Object.keys(GRAPH_MODE).map((graphMode, index) => (
                    <MenuButton
                      className={classNames({
                        'ml-1': index === 0,
                        'mr-1': index === Object.keys(VIEW_MODE).length - 1,
                        'border-left': index !== 0,
                      })}
                      key={graphMode}
                      active={graphOverview.graphMode === graphMode}
                      action={() => action(ACTION_CHANGE_GRAPH_MODE, {graphMode: graphMode})}
                      title={graphMode.charAt(0) + graphMode.slice(1).toLowerCase()}
                    />
                  ))}
                </ButtonGroup>
              )}

              <ButtonGroup className="my-1">
                <MenuButton
                  className="ml-1"
                  active={dateFilter.mode === DATE_FILTER.TOTAL}
                  action={() => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: DATE_FILTER.TOTAL})}
                  title="Total"
                />
                <MenuButton
                  className="border-left"
                  active={dateFilter.mode === DATE_FILTER.LAST30DAYS}
                  action={() => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: DATE_FILTER.LAST30DAYS})}
                  title="Last 30 Days"
                />
                <MenuButton
                  className="border-left"
                  active={dateFilter.mode === DATE_FILTER.LAST14DAYS}
                  action={() => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: DATE_FILTER.LAST14DAYS})}
                  title="Last 14 Days"
                />
                <MenuButton
                  className="border-left"
                  active={dateFilter.mode === DATE_FILTER.LAST7DAYS}
                  action={() => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: DATE_FILTER.LAST7DAYS})}
                  title="Last 7 Days"
                />
                <MenuButton
                  className="border-left"
                  active={dateFilter.mode === DATE_FILTER.SINGLE_DAY}
                  action={() =>
                    action(ACTION_CHANGE_DATE_FILTER_MODE, {
                      mode: DATE_FILTER.SINGLE_DAY,
                      startDate: overview.data.endDate,
                      endDate: overview.data.endDate,
                    })
                  }
                  title="Single Day"
                />
                <MenuButton
                  className="border-left"
                  active={dateFilter.mode === DATE_FILTER.CUSTOM_INTERVAL}
                  action={() =>
                    action(ACTION_CHANGE_DATE_FILTER_MODE, {
                      mode: DATE_FILTER.CUSTOM_INTERVAL,
                      startDate: overview.data.startDate,
                      endDate: overview.data.endDate,
                    })
                  }
                  title="Custom Interval"
                />
              </ButtonGroup>
              {dateFilter.mode === DATE_FILTER.SINGLE_DAY && (
                <Form.Control
                  className="m-1 d-inline-block"
                  style={{width: '150px'}}
                  as="select"
                  size="sm"
                  onChange={e => action(ACTION_CHANGE_DATE_FILTER_INTERVAL, {startDate: e.target.value})}
                  value={dateFilter.startDate}
                >
                  {overview.data?.datesAvailable?.map(date => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </Form.Control>
              )}
              {dateFilter.mode === DATE_FILTER.CUSTOM_INTERVAL && (
                <>
                  <Form.Control
                    className="m-1 d-inline-block"
                    style={{width: '150px'}}
                    as="select"
                    size="sm"
                    onChange={e => action(ACTION_CHANGE_DATE_FILTER_INTERVAL, {startDate: e.target.value})}
                    value={dateFilter.startDate}
                  >
                    {overview.data?.datesAvailable?.map(date => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control
                    className="m-1 d-inline-block"
                    style={{width: '150px'}}
                    as="select"
                    size="sm"
                    onChange={e => action(ACTION_CHANGE_DATE_FILTER_INTERVAL, {endDate: e.target.value})}
                    value={dateFilter.endDate}
                  >
                    {overview.data?.datesAvailable?.map(date => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </Form.Control>
                </>
              )}
            </Col>
          </Row>
        </Container>

        {message && (
          <Container>
            <Row>
              <Col xs={12}>
                <Alert
                  dismissible
                  variant={'info'}
                  className={'py-2 mt-3 fade in'}
                  onClose={() => action(ACTION_HEADER_MESSAGE_CLEAR)}
                >
                  {message}
                </Alert>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
  graphOverview: state.graphOverview,
})

const dispatchToProps = {}

export const Header = withRouter(connect(stateToProps, dispatchToProps)(withTranslation()(HeaderComponent)))
