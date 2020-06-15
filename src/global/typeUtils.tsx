import {IconDefinition, IconProp} from '@fortawesome/fontawesome-svg-core'
import {ACTION_EXPAND_ONLY_SIDEBAR_MENU, ACTION_TOGGLE_SIDEBAR_MENU, ASYNC_STATUS} from './constants'
import React from 'react'
import {ButtonProps} from 'react-bootstrap'
import {FocusedInputShape} from 'react-dates'
import {ColumnDescription, HeaderFormatter} from 'react-bootstrap-table-next'

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

export type GraphOverviewT = {
  graphScale: string;
  graphMode: string;
  metricsVisible: string[];
  barGraphVisible: boolean
  lineGraphVisible: boolean
}

export interface DateFilter {
  startDate: string
  endDate: string
  mode: string
  focusedInput: FocusedInputShape
}

export interface Data {
  rawData: RawData[]
  startDate: string | null
  endDate: string | null
  datesAvailable: string[]
  geoIds: string[]
  geoIdToNameMapping: Record<string, string>
  perDateData: Record<string, InitialDataEntry[]>
}

export interface Notification {
  message: string
  variant: string
  showSpinner: boolean
}

export interface Overview {
  tourEnabled: boolean
  tourCompleted: boolean
  loadingStatus: keyof typeof ASYNC_STATUS
  viewMode?: string
  dateFilter?: DateFilter
  selectedGeoIds: Record<string, string>
  data?: Data
  notification: Notification
  tableVisible: boolean
  rankingsVisible: boolean
  graphsVisible: boolean
}

export interface TableOverview {

}

export type RawData = {
  cases: string
  deaths: string
  popData2018: string
  dateRep: string
  countriesAndTerritories: string
  geoId: string
}

export interface DataEntry extends InitialDataEntry {
  cases_per_capita: number
  deaths_per_capita: number
  mortality_percentage: number
}

export interface PartialDataEntry extends InitialDataEntry {
  selected: boolean
  maxSelectionReached: boolean
}

export interface InitialDataEntry {
  name: string
  geoId: string
  population: number
  // cases_new:number TODO Fix this bug
  // deaths_new:number
  [x: string]: any
}

export interface LineGraphData {
  lineData: LineData[]
  logarithmParams: LogarithmParams
}

export type LogarithmParams = {
  min: number
  max: number
}

export type LineParsedData = {
  x: string
  y: string
}

export type LineData = {
  id: string
  geoId: string,
  data: LineParsedData[]
}

export interface GraphData extends LineGraphData {
  barData: BarGraphData
}

export type BarGraphData = {
  keys: string[]
  data: BarGraphEntryData[]
}

export type BarGraphEntryData = {
  date: string
  nameToGeoId: Record<string, string>
  [x: string]: any
}

export interface ColumnEntry extends Partial<ColumnDescription> {
  text?: string
  textPlaceholder?: string
  headerFormatter?: HeaderFormatter
  unitPlaceholder?: string
}
