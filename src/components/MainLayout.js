import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import Header from './Header'

class MainLayoutComponent extends React.Component {
  render() {
    return (
      <div>
        <Header title={this.props.pageTitle} />
        <Container fluid>{this.props.children}</Container>
        <Container>
          <Row>
            <Col xs={8}>
              <span className="font-weight-bold">JACKD</span> - Just Another COVID-19 Kick-ass Dashboard
            </Col>
            <Col xs={4} className="text-right">
              Data source:{' '}
              <a
                target="_blank"
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

const stateToProps = state => ({})

const dispatchToProps = {}

export const MainLayout = connect(stateToProps, dispatchToProps)(withTranslation()(MainLayoutComponent))
