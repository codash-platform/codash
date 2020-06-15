import {IconDefinition, IconProp} from '@fortawesome/fontawesome-svg-core'
import {ACTION_EXPAND_ONLY_SIDEBAR_MENU, ACTION_TOGGLE_SIDEBAR_MENU, ASYNC_STATUS} from './constants'
import React from 'react'
import {ButtonProps} from 'react-bootstrap'
import {FocusedInputShape} from 'react-dates'

export type ValueOf<T> = T[keyof T];

export type SubMenuT = {
  labelPlaceholder: string;
  key: string | number;
  action: Function;
}

export type MenuDataT = {
  id: string;
  labelPlaceholder: string;
  icon: IconDefinition;
  activeKeys: string[];
  subMenu: SubMenuT[];
  extraProps: Record<string, string>;
}

export type SidebarAction = {
  type?: typeof ACTION_TOGGLE_SIDEBAR_MENU | typeof ACTION_EXPAND_ONLY_SIDEBAR_MENU;
  menuId?: string;
  expanded?: boolean;
}

export interface SidebarComponentProps {
  backgroundColor: string;
  enableSidebarShadow: boolean;
}

export type GraphOverviewT = {
  graphScale: string;
  graphMode: string;
  metricsVisible: string[];
}

// @ts-ignore
export interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  icon: IconProp
  action: () => void
}

export interface DateFilter {
  startDate:string
  endDate:string
  mode:string
  focusedInput: FocusedInputShape
}

export interface Data {
  datesAvailable:string
}
export interface Notification {
  message:string
  variant:string
  showSpinner:boolean
}
export interface Overview {
  tourEnabled:boolean
  tourCompleted:boolean
  loadingStatus: keyof typeof ASYNC_STATUS
  viewMode?:string
  dateFilter?:DateFilter
  selectedGeoIds:Record<string, any>
  data?:Data
  notification:Notification
}

export type RawData ={
  cases:string
  deaths:string
  popData2018:string
  dateRep:string
  countriesAndTerritories:string
  geoId:string
}

export interface InitialDataEntry {
  name:string
  geoId:string
  population:number
  // cases_new:number TODO Fix this bug
  // deaths_new:number
  [x:string]:any
}
