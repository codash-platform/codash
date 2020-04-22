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
import {languageOrder} from '../global/i18n'
import {action} from '../global/util'
import {appName, isProduction} from '../global/variables'
import {graphMetricsOrder} from '../pages/overview/graph/Graphs'
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
    const {message, overview, graphOverview, t, i18n} = this.props
    const {graphsVisible} = overview
    const currentLanguage = i18n.language.substring(0, 2)
    const sortedLanguages = languageOrder.filter(language => i18n.languages.includes(language))

    return (
      <div id="header">
        <Container fluid>
          <Row>
            <Col lg={3} xs={2}>
              <Row>
                <Col lg={7} xs={12}>
                  <h2 className="m-0 text-light">{appName}</h2>
                </Col>
                <Col lg={5} xs={12}>
                  <Dropdown onSelect={language => i18n.changeLanguage(language)}>
                    <Dropdown.Toggle className="my-1" id="language-dropdown" size="sm" variant="light">
                      <img src={`/images/i18n/${currentLanguage}.svg`} alt={currentLanguage} className="flag" />
                      &nbsp;
                      <span>{t('global:language_iso_code', {lng: currentLanguage}).toUpperCase()}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="auto-width">
                      {sortedLanguages.map(language => {
                        const isLanguageActive = language === currentLanguage
                        return (
                          <Dropdown.Item
                            key={language}
                            eventKey={language}
                            className={classNames({
                              'text-dark': !isLanguageActive,
                              'bg-primary text-light': isLanguageActive,
                            })}
                          >
                            <img src={`/images/i18n/${language}.svg`} alt={language} className="flag" />
                            &nbsp;
                            <span>{t('global:language_iso_code', {lng: language}).toUpperCase()}</span>
                          </Dropdown.Item>
                        )
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
            <Col lg={9} xs={10}>
              <MenuButton variant="dark" action={() => action(ACTION_GET_DATA_START)} title={t('header:reload_data')} />
              {!isProduction && (
                <MenuButton variant="dark" action={() => action(ACTION_REPARSE_DATA)} title={t('header:reparse')} />
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
                    title={t(`header:view_mode_${viewMode}`)}
                  />
                ))}
              </ButtonGroup>

              <Dropdown
                className="d-inline-block mx-1"
                onSelect={eventKey => action(ACTION_CHANGE_DATE_FILTER_MODE, {mode: eventKey})}
              >
                <Dropdown.Toggle id="date-intervals" size="sm" variant="light">
                  {t('intervals:button_label')}
                </Dropdown.Toggle>

                <Dropdown.Menu className="auto-width">
                  {Object.values(DATE_FILTER).map(dateInterval => {
                    return (
                      <Dropdown.Item className="text-capitalize text-dark" key={dateInterval} eventKey={dateInterval}>
                        {t(`intervals:${dateInterval}`)}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <DateFilter className="mx-1" />

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
                        title={t(`header:graph_mode_${graphMode}`)}
                      />
                    ))}
                  </ButtonGroup>

                  <ButtonGroup className="my-1">
                    <MenuButton
                      className="ml-1"
                      active={graphOverview.metricsVisible.length === graphMetricsOrder.length}
                      action={() => action(ACTION_CHANGE_ALL_METRIC_GRAPH_VISIBILITY)}
                      title={t('header:metrics_all')}
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
                        title={t(`header:metrics_${metric}`)}
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
