import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'

class SidebarMenuSetComponent extends Component {
  state = {
    expanded: false,
  }

  render() {
    const {t, menuData} = this.props

    return (
      <li className="sidebar-menu-item">
        <a
          className="sidebar-menu-link"
          href="#"
          onClick={e => {
            e.preventDefault()
            this.setState(prevState => ({expanded: !prevState.expanded}))
          }}
        >
          <FontAwesomeIcon className="sidebar-menu-icon" icon={menuData.icon} />

          {t(menuData.labelPlaceholder)}
          <FontAwesomeIcon
            className={classNames({
              'sidebar-menu-state-icon': true,
              'rotate-minus-90': this.state.expanded,
            })}
            icon={faAngleDown}
          />
        </a>
        <ul
          className={classNames({
            'sidebar-menu-container': true,
            visible: this.state.expanded,
          })}
        >
          {menuData.subMenu.map(subMenuData => (
            <li key={subMenuData.key} className="sidebar-menu-item">
              <a
                className={classNames({
                  'sidebar-menu-link': true,
                  active: menuData.activeKeys.includes(subMenuData.key),
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

export const SidebarMenuSet = withTranslation()(SidebarMenuSetComponent)
