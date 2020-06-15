import classNames from 'classnames'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {connect} from 'react-redux'
import {HeaderLogo} from '../header/HeaderLogo'
import {SidebarMenus} from './SidebarMenus'

export interface SidebarComponentProps {
  backgroundColor: string;
  enableSidebarShadow: boolean;
}

class SidebarComponent extends Component<SidebarComponentProps> {
  render() {
    let {backgroundColor, enableSidebarShadow} = this.props

    return (
      <>
        <ReactCSSTransitionGroup
          component="div"
          className={classNames('app-sidebar', backgroundColor, {'sidebar-shadow': enableSidebarShadow})}
          transitionName="SidebarAnimation"
          transitionAppear={true}
          transitionAppearTimeout={1500}
          transitionEnter={false}
          transitionLeave={false}
        >
          <HeaderLogo/>
          <PerfectScrollbar>
            <div className="app-sidebar__inner">
              <SidebarMenus/>
            </div>
          </PerfectScrollbar>
        </ReactCSSTransitionGroup>
      </>
    )
  }
}

const mapStateToProps = state => ({
  enableSidebarShadow: state.theme.enableSidebarShadow,
  backgroundColor: state.theme.backgroundColor,
})

const mapDispatchToProps = dispatch => ({})

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarComponent)
