import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, {Component} from 'react'
import {WithTranslation, withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {ACTION_TOGGLE_SIDEBAR_MENU} from '../../global/constants'
import {action} from '../../global/util'
import {MenuDataT, SidebarAction} from '../../global/typeUtils'

export interface SidebarMenuSetComponentProps extends WithTranslation {
  menuData: MenuDataT;
  activeKeys: string[];
  sidebar: Record<string, SidebarAction>;
}

class SidebarMenuSetComponent extends Component<SidebarMenuSetComponentProps> {
  render() {
    const {t, menuData, activeKeys, sidebar} = this.props
    const expanded = sidebar[menuData.id]?.expanded ?? false

    return (
      <li className="sidebar-menu-item" {...menuData.extraProps}>
        <a
          className="sidebar-menu-link"
          href="#"
          onClick={e => {
            e.preventDefault()
            action(ACTION_TOGGLE_SIDEBAR_MENU, {menuId: menuData.id, expanded: !expanded})
          }}
        >
          <FontAwesomeIcon className="sidebar-menu-icon" icon={menuData.icon} />

          {t(menuData.labelPlaceholder)}
          <FontAwesomeIcon
            className={classNames({
              'sidebar-menu-state-icon': true,
              'rotate-minus-90': expanded,
            })}
            icon={faAngleDown}
          />
        </a>
        <ul
          className={classNames({
            'sidebar-menu-container': true,
            visible: expanded,
          })}
        >
          {menuData.subMenu.map(subMenuData => (
            <li key={subMenuData.key} className="sidebar-menu-item">
              <a
                className={classNames({
                  'sidebar-menu-link': true,
                  active: activeKeys.includes(subMenuData.key as string),
                })}
                title={t(subMenuData.labelPlaceholder)}
                href="#"
                onClick={e => {
                  e.preventDefault()
                  subMenuData.action()
                }}
              >
                {t(subMenuData.labelPlaceholder)}
              </a>
            </li>
          ))}
        </ul>
      </li>
    )
  }
}

const stateToProps = state => ({
  sidebar: state.sidebar,
})

const dispatchToProps = {}

export const SidebarMenuSet = connect(stateToProps, dispatchToProps)(withTranslation()(SidebarMenuSetComponent))
