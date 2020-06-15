import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {withTranslation, WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {Overview} from '../global/typeUtils'

interface NotificationBoxComponentProps extends WithTranslation {
  overview: Overview;
}

class NotificationBoxComponent extends Component<NotificationBoxComponentProps> {
  render() {
    const {t, overview} = this.props
    const message = overview.notification?.message
    const variant = overview.notification?.variant || 'info'
    const showSpinner = overview.notification?.showSpinner || false

    // @ts-ignore
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
