import {faEllipsisV} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import Hamburger from 'react-hamburgers'
import {connect} from 'react-redux'
import {ACTION_ENABLE_MOBILE_MENU, ACTION_ENABLE_MOBILE_MENU_SMALL} from '../../global/constants'
import {action} from '../../global/util'

interface MobileMenuComponentProps {
  enableMobileMenu: boolean;
  enableMobileMenuSmall: boolean;
}

class MobileMenuComponent extends Component<MobileMenuComponentProps> {
  render() {
    const {enableMobileMenu, enableMobileMenuSmall} = this.props

    return (
      <>
        <div className="app-header__mobile-menu">
          <Hamburger
            active={enableMobileMenu}
            type="elastic"
            onClick={() => action(ACTION_ENABLE_MOBILE_MENU, {enableMobileMenu: !enableMobileMenu})}
          />
        </div>
        <div className="app-header__menu">
          <Button
            size="sm"
            className={classNames('btn-icon btn-icon-only', {active: enableMobileMenuSmall})}
            variant="primary"
            onClick={() => action(ACTION_ENABLE_MOBILE_MENU_SMALL, {enableMobileMenuSmall: !enableMobileMenuSmall})}
          >
            <div className="btn-icon-wrapper">
              <FontAwesomeIcon icon={faEllipsisV}/>
            </div>
          </Button>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  enableMobileMenu: state.theme.enableMobileMenu,
  enableMobileMenuSmall: state.theme.enableMobileMenuSmall,
})

const mapDispatchToProps = dispatch => ({})

export const MobileMenu = connect(mapStateToProps, mapDispatchToProps)(MobileMenuComponent)
