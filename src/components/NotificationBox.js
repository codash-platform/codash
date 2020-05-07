import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'

class NotificationBoxComponent extends Component {
  render() {
    const {t, overview} = this.props
    const message = overview.notification?.message
    const variant = overview.notification?.variant || 'info'
    const showSpinner = overview.notification?.showSpinner || false

    return (
      <Row>
        <Col xs={12}>
          {message && (
            <Alert variant={variant}>
              {t(message)}
              {showSpinner && (
                <>
                  &nbsp;
                  <FontAwesomeIcon icon={faSpinner} spin={true} />
                </>
              )}
            </Alert>
          )}
        </Col>
      </Row>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const NotificationBox = connect(stateToProps, dispatchToProps)(withTranslation()(NotificationBoxComponent))
