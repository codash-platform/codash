import {IconDefinition} from '@fortawesome/fontawesome-svg-core'
import {
  ACTION_EXPAND_ONLY_SIDEBAR_MENU,
  ACTION_TOGGLE_SIDEBAR_MENU,
  ASYNC_STATUS,
  METRIC,
  TABLE_TYPE,
} from './constants'
import React from 'react'
import {FocusedInputShape} from 'react-dates'
import {ColumnDescription, HeaderFormatter} from 'react-bootstrap-table-next'
import {Variant} from 'react-bootstrap/esm/types'

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
  barGraphVisible: boolean;
  lineGraphVisible: boolean;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
  mode: string;
  focusedInput: FocusedInputShape;
}

export interface Data {
  rawData: RawData[];
  startDate: string | null;
  endDate: string | null;
  datesAvailable: string[];
  geoIds: string[];
  geoIdToNameMapping: Record<string, string>;
  perDateData: Record<string, DataEntry[]>;
}

export interface Notification {
  message: string;
  variant: Variant;
  showSpinner: boolean;
}

export interface Overview {
  tourEnabled: boolean;
  tourCompleted: boolean;
  loadingStatus: ASYNC_STATUS;
  viewMode?: string;
  dateFilter?: DateFilter;
  selectedGeoIds: Record<string, string>;
  data?: Data;
  notification: Notification;
  tableVisible: boolean;
  rankingsVisible: boolean;
  graphsVisible: boolean;
}

export interface TableOverview {
  [TABLE_TYPE.CASES_NEW]: CustomTableEntry;
  [TABLE_TYPE.CASES_ACCUMULATED]: CustomTableEntry;
  [TABLE_TYPE.CASES_PER_CAPITA]: CustomTableEntry;
  [TABLE_TYPE.CASES_PER_CAPITA_ACCUMULATED]: CustomTableEntry;
  [TABLE_TYPE.DEATHS_NEW]: CustomTableEntry;
  [TABLE_TYPE.DEATHS_ACCUMULATED]: CustomTableEntry;
  [TABLE_TYPE.DEATHS_PER_CAPITA]: CustomTableEntry;
  [TABLE_TYPE.DEATHS_PER_CAPITA_ACCUMULATED]: CustomTableEntry;
  [TABLE_TYPE.MORTALITY_PERCENTAGE]: CustomTableEntry;
  [TABLE_TYPE.MORTALITY_PERCENTAGE_ACCUMULATED]: CustomTableEntry;
  [TABLE_TYPE.MAIN]: CustomTableEntry;
}

export interface CustomTableEntry {
  sizePerPage: number;
}

export type RawData = {
  cases: string;
  deaths: string;
  popData2019?: string;
  popData2018?: string;
  dateRep: string;
  countriesAndTerritories: string;
  geoId: string;
}

export interface DataEntry extends InitialDataEntry, AccumulatedDataEntry, RatesEntry {}

export interface RatesDataEntry extends InitialDataEntry, RatesEntry {}

export interface TableDataEntry extends DataEntry {
  selected: boolean;
  maxSelectionReached: boolean;
}

export interface AccumulatedDataEntry {
  [METRIC.CASES_ACCUMULATED]: number;
  [METRIC.CASES_PER_CAPITA_ACCUMULATED]: number;
  [METRIC.DEATHS_ACCUMULATED]: number;
  [METRIC.DEATHS_PER_CAPITA_ACCUMULATED]: number;
  [METRIC.MORTALITY_PERCENTAGE_ACCUMULATED]: number;
}

export interface RatesEntry {
  [METRIC.CASES_PER_CAPITA]: number;
  [METRIC.DEATHS_PER_CAPITA]: number;
  [METRIC.MORTALITY_PERCENTAGE]: number;
}

export interface InitialDataEntry {
  name: string;
  geoId: string;
  population: number;
  [METRIC.CASES_NEW]: number;
  [METRIC.DEATHS_NEW]: number;
}

export interface LineGraphData {
  lineData: LineData[];
  logarithmParams: LogarithmParams;
}

export type LogarithmParams = {
  min: number;
  max: number;
}

export type LineParsedData = {
  x: string;
  y: string;
}

export type LineData = {
  id: string;
  geoId: string;
  data: LineParsedData[];
}

export interface GraphData extends LineGraphData, BarGraphData {}

export type BarGraphData = {
  barData: BarData;
}

export type BarData = {
  keys: string[];
  data: BarEntryData[];
}

export type BarEntryData = {
  date: string;
  nameToGeoId: Record<string, string>;
}

export interface ColumnEntry extends Partial<ColumnDescription> {
  text?: string;
  textPlaceholder?: string;
  headerFormatter?: HeaderFormatter;
  infoPlaceholder?: string;
}
