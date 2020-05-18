import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
import {faCalculator, faRedo} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {Button, Dropdown} from 'react-bootstrap'
import {withTranslation,WithTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {
  ACTION_CHANGE_TOUR_STATE,
  ACTION_GET_DATA_START,
  ACTION_REPARSE_DATA,
  ASYNC_STATUS,
} from '../../global/constants'
import {languageOrder} from '../../global/i18n'
import {action} from '../../global/util'
import {isProduction} from '../../global/variables'
import {DateFilter} from '../DateFilter'
import {HeaderLogo} from './HeaderLogo'

const MenuButton = props => {
  const className = props.className || 'mx-1'
  const variant = props.variant || 'codash-translucent'
  const disabled = props.disabled || false

  return (
    <Button size="sm" className={className} disabled={disabled} variant={variant} onClick={props.action}>
      {props.icon && <FontAwesomeIcon className="mr-2" size={'sm'} icon={props.icon} />}
      {props.title}
    </Button>
  )
}

interface HeaderComponentI extends WithTranslation{
	[any: string]: any;
}
class HeaderComponent extends Component<HeaderComponentI> {
  render() {
    const {
      overview,
      t,
      i18n,
      headerBackgroundColor,
      enableMobileMenuSmall,
      enableHeaderShadow,
      isDeviceDesktop,
    } = this.props
    const currentLanguage = i18n.language.substring(0, 2)
    const sortedLanguages = languageOrder.filter(language => i18n.languages.includes(language))

    return (
      <ReactCSSTransitionGroup
        component="div"
        className={classNames('app-header', headerBackgroundColor, {'header-shadow': enableHeaderShadow})}
        transitionName="HeaderAnimation"
        transitionAppear={true}
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <HeaderLogo />

        <div
          className={classNames('app-header__content', headerBackgroundColor, {
            'header-mobile-open': enableMobileMenuSmall,
          })}
        >
          <div className="app-header-left">
            <DateFilter className="m-1" id={'date-picker'} />
          </div>

          <div className="app-header-right">
            {isDeviceDesktop && (
              <MenuButton
                className="tour-button mx-1"
                disabled={overview.tourEnabled}
                action={() => action(ACTION_CHANGE_TOUR_STATE, {enabled: true})}
                title={t('menu:start_tour')}
                icon={faQuestionCircle}
              />
            )}
            <MenuButton
              disabled={overview.loadingStatus === ASYNC_STATUS.PENDING}
              action={() => action(ACTION_GET_DATA_START)}
              title={t('menu:reload_data')}
              icon={faRedo}
            />
            {!isProduction && (
              <MenuButton icon={faCalculator} action={() => action(ACTION_REPARSE_DATA)} title={t('menu:reparse')} />
            )}
            <Dropdown className="m-1 d-inline-block" onSelect={language => i18n.changeLanguage(language)}>
			{/* @ts-ignore */}
              <Dropdown.Toggle id={'language-dropdown'} size="sm" variant="codash-translucent" className="text-white">
                <img src={`/images/i18n/${currentLanguage}.svg`} alt={currentLanguage} className="flag" />
                &nbsp;
                <span>{t('global:language_iso_code', {lng: currentLanguage}).toUpperCase()}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="auto-width bg-codash-primary">
                {sortedLanguages.map(language => {
                  const isLanguageActive = language === currentLanguage
                  return (
                    <Dropdown.Item
                      key={language}
                      eventKey={language}
                      className={classNames({
                        'text-white': true,
                        'bg-primary': isLanguageActive,
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
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

const stateToProps = state => ({
  overview: state.overview,
  tableOverview: state.tableOverview,
  graphOverview: state.graphOverview,
  enableHeaderShadow: state.theme.enableHeaderShadow,
  headerBackgroundColor: state.theme.headerBackgroundColor,
  enableMobileMenuSmall: state.theme.enableMobileMenuSmall,
  isDeviceDesktop: state.theme.isDeviceDesktop,
})

const dispatchToProps = {}

export const Header = withRouter(connect(stateToProps, dispatchToProps)(withTranslation()(HeaderComponent)))
