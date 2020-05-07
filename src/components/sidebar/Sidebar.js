import classNames from 'classnames'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {connect} from 'react-redux'
import {ACTION_ENABLE_MOBILE_MENU} from '../../global/constants'
import {HeaderLogo} from '../header/HeaderLogo'
import {SidebarMenus} from './SidebarMenus'

class SidebarComponent extends Component {
  render() {
    let {backgroundColor, enableSidebarShadow, enableMobileMenu} = this.props

    return (
      <>
        <div
          className="sidebar-mobile-overlay"
          onClick={() => action(ACTION_ENABLE_MOBILE_MENU, {enableMobileMenu: !enableMobileMenu})}
        />
        <ReactCSSTransitionGroup
          component="div"
          className={classNames('app-sidebar', backgroundColor, {'sidebar-shadow': enableSidebarShadow})}
          transitionName="SidebarAnimation"
          transitionAppear={true}
          transitionAppearTimeout={1500}
          transitionEnter={false}
          transitionLeave={false}
        >
          <HeaderLogo />
          <PerfectScrollbar>
            <div className="app-sidebar__inner">
              <SidebarMenus />
            </div>
          </PerfectScrollbar>
        </ReactCSSTransitionGroup>
      </>
    )
  }
}

const mapStateToProps = state => ({
  enableSidebarShadow: state.theme.enableSidebarShadow,
  enableMobileMenu: state.theme.enableMobileMenu,
  backgroundColor: state.theme.backgroundColor,
})

const mapDispatchToProps = dispatch => ({})

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarComponent)
