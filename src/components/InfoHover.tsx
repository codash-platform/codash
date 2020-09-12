import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import {useTranslation} from 'react-i18next'

type InfoHoverProps = {
  messagePlaceholder: string;
  className?: string;
}

export const InfoHover: React.FC<InfoHoverProps> = ({messagePlaceholder, className = 'ml-2'}) => {
  const {t} = useTranslation()

  return (
    <OverlayTrigger
      placement="auto"
      delay={{show: 0, hide: 100}}
      overlay={<Tooltip id="button-tooltip">{t(messagePlaceholder)}</Tooltip>}
    >
      <FontAwesomeIcon className={className} icon={faInfoCircle} />
    </OverlayTrigger>
  )
}
