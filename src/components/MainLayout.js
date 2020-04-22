import PropTypes from 'prop-types'
import React from 'react'
import {Col, Container, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {appName} from '../global/variables'
import {Header} from './Header'

class MainLayoutComponent extends React.Component {
  render({children, pageTitle, t} = this.props) {
    return (
      <div>
        <Header title={pageTitle} />
        <Container fluid>{children}</Container>
        <Container fluid>
          <Row>
            <Col xs={8}>
              &copy;{' '}
              <a className="font-weight-bold" href="https://github.com/jackd-platform/jackd">
                {appName}
              </a>
              {t('footer:signature')}
            </Col>
            <Col xs={4} className="text-right">
              {t('footer:data_source')}
              <a
                target="_blank"
                className="font-weight-bold"
                href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide"
              >
                {t('footer:data_source_ecdc')}
              </a>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

MainLayoutComponent.propTypes = {
  children: PropTypes.element.isRequired,
  pageTitle: PropTypes.string,
}

const stateToProps = state => ({})

const dispatchToProps = {}

export const MainLayout = connect(stateToProps, dispatchToProps)(withTranslation()(MainLayoutComponent))
