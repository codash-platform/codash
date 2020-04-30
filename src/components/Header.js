import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React from 'react'
import {Button, ButtonGroup, Col, Container, Dropdown, InputGroup, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  ACTION_CHANGE_DATE_FILTER_MODE,
  ACTION_CHANGE_GRAPH_MODE,
  ACTION_CHANGE_GRAPH_SCALE,
  ACTION_CHANGE_METRIC_GRAPH_VISIBILITY,
  ACTION_CHANGE_VIEW_MODE,
  ACTION_GET_DATA_START,
  ACTION_REPARSE_DATA,
  DATE_FILTER,
  GRAPH_MODE,
  GRAPH_SCALE,
  VIEW_MODE,
} from '../global/constants'
import {languageOrder} from '../global/i18n'
import {action} from '../global/util'
import {appName, isProduction} from '../global/variables'
import {graphMetricsOrder} from '../pages/overview/graph/Graphs'
import {DateFilter} from './DateFilter'

const MenuButton = props => {
  const className = props.className || 'mx-1'
  const variant = props.variant || 'light'

  return (
    <Button size="sm" className={className} variant={variant} onClick={props.action}>
      {props.title}
    </Button>
  )
}

class HeaderComponent extends React.Component {
  renderMainBar(barId) {
    const {overview, graphOverview, t, i18n} = this.props
    const {graphsVisible} = overview
    const currentLanguage = i18n.language.substring(0, 2)
    const sortedLanguages = languageOrder.filter(language => i18n.languages.includes(language))

    return (
      <Row>
        <Col xs={2}>
          <h2 className="m-0 text-light">{appName}</h2>
        </Col>
        <Col xs={10}>
          <Dropdown className="m-1 d-inline-block" onSelect={language => i18n.changeLanguage(language)}>
            <Dropdown.Toggle id={`language-dropdown-${barId}`} size="sm" variant="light">
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
          <MenuButton variant="dark" action={() => action(ACTION_GET_DATA_START)} title={t('header:reload_data')} />
          {!isProduction && (
            <MenuButton variant="dark" action={() => action(ACTION_REPARSE_DATA)} title={t('header:reparse')} />
          )}

          <Dropdown
            className="m-1"
            as={ButtonGroup}
            onSelect={eventKey => action(ACTION_CHANGE_VIEW_MODE, {viewMode: eventKey})}
          >
            <InputGroup size="sm" variant="info">
              <InputGroup.Prepend>
                <InputGroup.Text disabled>{t('header:view_mode_label')}</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>

            <Dropdown.Toggle id="view-mode" size="sm" variant="light">
              {t(`header:view_mode_${overview.viewMode}`)}
            </Dropdown.Toggle>

            <Dropdown.Menu className="auto-width">
              {Object.values(VIEW_MODE).map(viewMode => {
                const isActive = overview.viewMode === viewMode
                return (
                  <Dropdown.Item
                    className={classNames({
                      'text-dark': !isActive,
                      'bg-primary text-light': isActive,
                    })}
                    key={viewMode}
                    eventKey={viewMode}
                  >
                    {t(`header:view_mode_${viewMode}`)}
                  </Dropdown.Item>
                )
              })}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown
            className="d-inline-block m-1"
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

          <DateFilter className="m-1" id={`date-picker-${barId}`} />

          {graphsVisible && (
            <>
              <Dropdown
                className="m-1"
                as={ButtonGroup}
                onSelect={eventKey => action(ACTION_CHANGE_GRAPH_MODE, {graphMode: eventKey})}
              >
                <InputGroup size="sm" variant="info">
                  <InputGroup.Prepend>
                    <InputGroup.Text disabled>{t('header:graph_mode_label')}</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>

                <Dropdown.Toggle id="graph-mode" size="sm" variant="light">
                  {t(`header:graph_mode_${graphOverview.graphMode}`)}
                </Dropdown.Toggle>

                <Dropdown.Menu className="auto-width">
                  {Object.values(GRAPH_MODE).map(graphMode => {
                    const isActive = graphOverview.graphMode === graphMode
                    return (
                      <Dropdown.Item
                        className={classNames({
                          'text-dark': !isActive,
                          'bg-primary text-light': isActive,
                        })}
                        key={graphMode}
                        eventKey={graphMode}
                      >
                        {t(`header:graph_mode_${graphMode}`)}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                className="m-1"
                as={ButtonGroup}
                onSelect={eventKey => action(ACTION_CHANGE_METRIC_GRAPH_VISIBILITY, {metric: eventKey})}
              >
                <InputGroup size="sm" variant="info">
                  <InputGroup.Prepend>
                    <InputGroup.Text disabled>{t('header:graph_metrics_label')}</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>

                <Dropdown.Toggle id="graph-metrics" size="sm" variant="light">
                  {t('header:graph_metrics_selected', {selected: graphOverview.metricsVisible.length})}
                </Dropdown.Toggle>

                <Dropdown.Menu className="auto-width">
                  <Dropdown.Item className="text-dark" eventKey={'all'}>
                    <span className="mr-4" />
                    {t('header:metrics_all')}
                  </Dropdown.Item>
                  <Dropdown.Item className="text-dark" eventKey={'none'}>
                    <span className="mr-4" />
                    {t('header:metrics_none')}
                  </Dropdown.Item>
                  {graphMetricsOrder.map(metric => {
                    const isActive = graphOverview.metricsVisible.includes(metric)
                    return (
                      <Dropdown.Item className="text-dark" key={metric} eventKey={metric}>
                        {isActive && <FontAwesomeIcon className="mr-2" icon={faCheck} />}
                        {!isActive && <span className="mr-4" />}
                        {t(`header:metrics_${metric}`)}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                className="m-1"
                as={ButtonGroup}
                onSelect={eventKey => action(ACTION_CHANGE_GRAPH_SCALE, {graphScale: eventKey})}
              >
                <InputGroup size="sm" variant="info">
                  <InputGroup.Prepend>
                    <InputGroup.Text disabled>{t('header:graph_scale_label')}</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>

                <Dropdown.Toggle id="graph-scale" size="sm" variant="light">
                  {t(`header:graph_scale_${graphOverview.graphScale}`)}
                </Dropdown.Toggle>

                <Dropdown.Menu className="auto-width">
                  {Object.values(GRAPH_SCALE).map(graphScale => {
                    const isActive = graphOverview.graphScale === graphScale
                    return (
                      <Dropdown.Item
                        className={classNames({
                          'text-dark': !isActive,
                          'bg-primary text-light': isActive,
                        })}
                        key={graphScale}
                        eventKey={graphScale}
                      >
                        {t(`header:graph_scale_${graphScale}`)}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Col>
      </Row>
    )
  }

  render() {
    return (
      <>
        <Container id="header" className="bg-primary" fluid>
          {this.renderMainBar(1)}
        </Container>
        {/* Hacky solution to reserve the space underneath the fixed element by doubling the contents in an */}
        {/* invisible div. Alternative workarounds have more problems, so gonna use this one for the time being. */}
        <Container className="invisible" fluid>
          {this.renderMainBar(2)}
        </Container>
      </>
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
