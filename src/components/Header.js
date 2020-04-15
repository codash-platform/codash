import React from 'react'
import {Alert, Button, ButtonGroup, Col, Container, Form, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  ACTION_CHANGE_DATA_SOURCE,
  ACTION_CHANGE_SELECTED_DAY,
  ACTION_GET_DATA_START,
  ACTION_HEADER_MESSAGE_CLEAR,
  ACTION_REPARSE_DATA,
  TABLE_MODES,
} from '../global/constants'
import {action} from '../global/util'
import {appName, isProduction} from '../global/variables'

const MenuButton = props => {
  let className = props.className || 'my-1 mx-1'
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
    const {message, overview, tableOverview} = this.props

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
              <ButtonGroup>
                <MenuButton
                  className="my-1 ml-1"
                  active={tableOverview.tableMode === TABLE_MODES.TOTAL}
                  action={() => action(ACTION_CHANGE_DATA_SOURCE, {tableMode: TABLE_MODES.TOTAL})}
                  title="Total"
                />
                <MenuButton
                  className="my-1 border-left"
                  active={tableOverview.tableMode === TABLE_MODES.LAST14DAYS}
                  action={() => action(ACTION_CHANGE_DATA_SOURCE, {tableMode: TABLE_MODES.LAST14DAYS})}
                  title="Last 14 Days"
                />
                <MenuButton
                  className="my-1 border-left"
                  active={tableOverview.tableMode === TABLE_MODES.LAST7DAYS}
                  action={() => action(ACTION_CHANGE_DATA_SOURCE, {tableMode: TABLE_MODES.LAST7DAYS})}
                  title="Last 7 Days"
                />
                <MenuButton
                  className="my-1 mr-1 border-left"
                  active={tableOverview.tableMode === TABLE_MODES.SINGLE_DAY}
                  action={() =>
                    action(ACTION_CHANGE_DATA_SOURCE, {
                      tableMode: TABLE_MODES.SINGLE_DAY,
                      day: overview.data.mostRecentDay,
                    })
                  }
                  title="Single Day"
                />
              </ButtonGroup>
              {tableOverview.tableMode === TABLE_MODES.SINGLE_DAY && (
                <Form.Control
                  className="my-1 mx-1 d-inline-block"
                  style={{width: '150px'}}
                  as="select"
                  size="sm"
                  onChange={e => action(ACTION_CHANGE_SELECTED_DAY, {selectedDay: e.target.value})}
                  value={tableOverview.selectedDay}
                >
                  {overview.data?.datesAvailable?.map(date => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </Form.Control>
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
})

const dispatchToProps = {}

export const Header = withRouter(connect(stateToProps, dispatchToProps)(withTranslation()(HeaderComponent)))
