import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import React, {Component} from 'react'
import {Alert, Col, Row} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {Overview} from '../global/typeUtils'

type NotificationBoxComponentProps = {
  overview: Overview;
}

type NotificationBoxElementProps = {
  messagePlaceholder: string;
  variant?: string;
  showSpinner?: boolean;
}

export const NotificationBoxElement: React.FC<NotificationBoxElementProps> = ({
  messagePlaceholder,
  variant = 'info',
  showSpinner = false,
}) => {
  const {t} = useTranslation()
  return (
    <Row>
      <Col xs={12}>
        <Alert variant={variant}>
          {t(messagePlaceholder)}
          {showSpinner && (
            <>
              &nbsp;
              <FontAwesomeIcon icon={faSpinner} spin={true} />
            </>
          )}
        </Alert>
      </Col>
    </Row>
  )
}

class NotificationBoxComponent extends Component<NotificationBoxComponentProps> {
  render() {
    const {overview} = this.props
    const messagePlaceholder = overview.notification?.message

    if (!messagePlaceholder) {
      return null
    }

    const variant = overview.notification?.variant ?? 'info'
    const showSpinner = overview.notification?.showSpinner ?? false

    return (
      <NotificationBoxElement messagePlaceholder={messagePlaceholder} variant={variant} showSpinner={showSpinner} />
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const NotificationBox = connect(stateToProps, dispatchToProps)(NotificationBoxComponent)
