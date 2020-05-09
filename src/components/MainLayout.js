import classNames from 'classnames'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import ResizeDetector from 'react-resize-detector'
import {Router} from 'react-router-dom'
import {Footer} from './Footer'
import {APP_ROUTES} from '../global/routes'
import {history} from '../global/store'
import {Header} from './header/Header'
import {NotificationBox} from './NotificationBox'
import {Sidebar} from './sidebar/Sidebar'

class MainLayoutComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closedSmallerSidebar: false,
      width: undefined,
    }
  }

  onResize = width => this.setState({width})

  render() {
    const {width} = this.state

    let {
      colorScheme,
      enableFixedHeader,
      enableFixedSidebar,
      enableFixedFooter,
      closedSidebar,
      closedSmallerSidebar,
      enableMobileMenu,
    } = this.props

    return (
      <Router history={history}>
        <div
          className={classNames(
            'app-container app-theme-' + colorScheme,
            {'fixed-header': enableFixedHeader},
            {'fixed-sidebar': enableFixedSidebar || width < 1250},
            {'fixed-footer': enableFixedFooter},
            {'closed-sidebar': closedSidebar || width < 1250},
            {'closed-sidebar-mobile': closedSmallerSidebar || width < 1250},
            {'sidebar-mobile-open': enableMobileMenu}
          )}
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
})

const dispatchToProps = {}

export const MainLayout = connect(stateToProps, dispatchToProps)(withTranslation()(MainLayoutComponent))
