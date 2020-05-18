import React, {Component} from 'react'
import Hamburger from 'react-hamburgers'
import {connect} from 'react-redux'
import {ACTION_TOGGLE_SIDEBAR} from '../../global/constants'
import {action} from '../../global/util'
import {MobileMenu} from './MobileMenu'
interface HeaderLogoComponentI {
	[any: string]: any;
}
class HeaderLogoComponent extends Component<HeaderLogoComponentI> {
  render() {
    const {closedSidebar} = this.props

    return (
      <>
        <div className="app-header__logo">
          <div className="logo-src" />
          <div className="header__pane ml-auto">
            <Hamburger
              active={closedSidebar}
              type="elastic"
              onClick={() => action(ACTION_TOGGLE_SIDEBAR, {closedSidebar: !closedSidebar})}
            />
          </div>
        </div>
        <MobileMenu />
      </>
    )
  }
}

const mapStateToProps = state => ({
  closedSidebar: state.theme.closedSidebar,
  enableMobileMenu: state.theme.enableMobileMenu,
  enableMobileMenuSmall: state.theme.enableMobileMenuSmall,
})

const mapDispatchToProps = dispatch => ({})

export const HeaderLogo = connect(mapStateToProps, mapDispatchToProps)(HeaderLogoComponent)
