import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React from 'react'
import {Alert, Col, Container, Row} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'

class NotificationBoxComponent extends React.Component {
  render() {
    const {t, overview} = this.props
    const message = overview.notification?.message
    const variant = overview.notification?.variant || 'info'
    const showSpinner = overview.notification?.showSpinner || false

    return (
      <Container fluid>
        <Row>
          <Col xs={12}>
            {message && (
              <Alert variant={variant} className="mt-3">
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
      </Container>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const NotificationBox = connect(stateToProps, dispatchToProps)(withTranslation()(NotificationBoxComponent))
