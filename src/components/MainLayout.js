import classNames from 'classnames'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import ResizeDetector from 'react-resize-detector'
import {Router} from 'react-router-dom'
import {ACTION_SET_DESKTOP_DEVICE} from '../global/constants'
import {action} from '../global/util'
import {Footer} from './Footer'
import {APP_ROUTES} from '../global/routes'
import {history} from '../global/store'
import {Header} from './header/Header'
import {NotificationBox} from './NotificationBox'
import {Sidebar} from './sidebar/Sidebar'

class MainLayoutComponent extends Component {
  isDeviceDesktop = width => width >= 1250

  onResize = width => {
    const isDeviceDesktop = this.isDeviceDesktop(width)

    if (this.props.isDeviceDesktop !== isDeviceDesktop) {
      action(ACTION_SET_DESKTOP_DEVICE, {isDeviceDesktop: isDeviceDesktop})
    }
  }

  render() {
    let {
      colorScheme,
      enableFixedHeader,
      enableFixedSidebar,
      enableFixedFooter,
      closedSidebar,
      closedSmallerSidebar,
      enableMobileMenu,
      isDeviceDesktop,
    } = this.props

    return (
      <Router history={history}>
        <div
          className={classNames({
            ['app-container app-theme-' + colorScheme]: true,
            'fixed-header': enableFixedHeader,
            'fixed-sidebar': enableFixedSidebar || !isDeviceDesktop,
            'fixed-footer': enableFixedFooter,
            'closed-sidebar': closedSidebar || !isDeviceDesktop,
            'closed-sidebar-mobile': closedSmallerSidebar || !isDeviceDesktop,
            'sidebar-mobile-open': enableMobileMenu,
          })}
        >
          <Header />
          <div className="app-main">
            <Sidebar />
            <div className="app-main__outer">
              <div className="app-main__inner">
                <NotificationBox />
                {APP_ROUTES}
              </div>
              <Footer />
            </div>
          </div>
          <ResizeDetector handleWidth onResize={this.onResize} />
        </div>
      </Router>
    )
  }
}

const stateToProps = state => ({
  colorScheme: state.theme.colorScheme,
  enableFixedHeader: state.theme.enableFixedHeader,
  enableMobileMenu: state.theme.enableMobileMenu,
  enableFixedFooter: state.theme.enableFixedFooter,
  enableFixedSidebar: state.theme.enableFixedSidebar,
  closedSidebar: state.theme.closedSidebar,
  isDeviceDesktop: state.theme.isDeviceDesktop,
})

const dispatchToProps = {}

export const MainLayout = connect(stateToProps, dispatchToProps)(withTranslation()(MainLayoutComponent))
