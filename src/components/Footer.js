import moment from 'moment'
import React, {Component} from 'react'
import {Col, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {DATE_TIME_FORMAT_APP} from '../global/constants'
import {appName, buildTime} from '../global/variables'

class FooterComponent extends Component {
  render() {
    const {t} = this.props

    return (
      <div className="app-footer">
        <div className="app-footer__inner">
          <Col xs={8}>
            <Row>
              <Col xs={12}>
                &copy;{' '}
                <a className="font-weight-bold" href="https://github.com/codash-platform/codash">
                  {appName}
                </a>
                {t('footer:signature')}
              </Col>
              {buildTime && (
                <Col xs={12}>
                  {t('footer:build_time', {
                    time: moment(buildTime)
                      .utc()
                      .format(DATE_TIME_FORMAT_APP),
                  })}
                </Col>
              )}
            </Row>
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
        </div>
      </div>
    )
  }
}

const stateToProps = state => ({})

const dispatchToProps = {}

export const Footer = connect(stateToProps, dispatchToProps)(withTranslation()(FooterComponent))
