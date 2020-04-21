import classNames from 'classnames'
import React from 'react'
import {Alert, Button, ButtonGroup, Col, Container, Dropdown, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  ACTION_CHANGE_ALL_METRIC_GRAPH_VISIBILITY,
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
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
import {graphMetricsOrder, graphProperties} from '../pages/overview/graph/Graphs'
import {DateFilter} from './DateFilter'

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
    const {graphsVisible} = overview

    return (
      <div id="header">
        <Container fluid>
          <Row>
            <Col xs={2}>
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

              <Dropdown
                className="d-inline-block mx-1"
                onSelect={eventKey => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: eventKey})}
              >
                <Dropdown.Toggle id="date-intervals" size="sm" variant="light">
                  Quick Intervals
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {Object.values(DATE_FILTER).map(dateInterval => {
                    return (
                      <Dropdown.Item className="text-capitalize text-dark" key={dateInterval} eventKey={dateInterval}>
                        {dateInterval
                          .split('_')
                          .join(' ')
                          .toLowerCase()}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <DateFilter className="ml-2" />

              {graphsVisible && (
                <>
                  <ButtonGroup className="my-1">
                    {Object.keys(GRAPH_MODE).map((graphMode, index) => (
                      <MenuButton
                        className={classNames({
                          'ml-1': index === 0,
                          'mr-1': index === Object.keys(GRAPH_MODE).length - 1,
                          'border-left': index !== 0,
                        })}
                        key={graphMode}
                        active={graphOverview.graphMode === graphMode}
                        action={() => action(ACTION_CHANGE_GRAPH_MODE, {graphMode: graphMode})}
                        title={graphMode.charAt(0) + graphMode.slice(1).toLowerCase()}
                      />
                    ))}
                  </ButtonGroup>

                  <ButtonGroup className="my-1">
                    <MenuButton
                      className="ml-1"
                      active={graphOverview.metricsVisible.length === graphMetricsOrder.length}
                      action={() => action(ACTION_CHANGE_ALL_METRIC_GRAPH_VISIBILITY)}
                      title="All"
                    />
                    {graphMetricsOrder.map((metric, index) => (
                      <MenuButton
                        className={classNames({
                          'mr-1': index === graphMetricsOrder.length - 1,
                          'border-left': true,
                        })}
                        key={metric}
                        active={graphOverview.metricsVisible.includes(metric)}
                        action={() => action(ACTION_CHANGE_METRIC_GRAPH_VISIBILITY, {metric: metric})}
                        title={graphProperties[metric].label}
                      />
                    ))}
                  </ButtonGroup>
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
