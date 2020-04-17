import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {Header} from './Header'
import PropTypes from 'prop-types';

class MainLayoutComponent extends React.Component {
  render({children, pageTitle} = this.props) {
    return (
      <div>
        <Header title={pageTitle} />
        <Container fluid>{children}</Container>
        <Container fluid>
          <Row>
            <Col xs={8}>
              &copy;{' '}
              <a className="font-weight-bold" href="https://github.com/popa-marius/jackd">
                JACKD
              </a>{' '}
              - Just Another COVID-19 Kick-ass Dashboard
            </Col>
            <Col xs={4} className="text-right">
              Data source:{' '}
              <a
                target="_blank"
                className="font-weight-bold"
                href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide"
              >
                ECDC
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
