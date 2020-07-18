import moment from 'moment'
import React from 'react'
import {DateRangePicker} from 'react-dates'
import {connect} from 'react-redux'
import {ACTION_CHANGE_DATE_FILTER_INTERVAL, ACTION_TOGGLE_DATE_FILTER, DATE_FORMAT_APP} from '../global/constants'
import {action} from '../global/util'
import {Overview} from '../global/typeUtils'

interface DateFilterComponentProps extends React.HTMLProps<{}> {
  overview: Overview;
  isDeviceDesktop: boolean;
}

const DateFilterComponent: React.FC<DateFilterComponentProps> = props => {
  const {overview, className, id, isDeviceDesktop} = props
  const {dateFilter} = overview
  const startDate = dateFilter.startDate ?? null
  const endDate = dateFilter.endDate ?? null
  let startDateObj = null
  let endDateObj = null

  if (startDate) {
    startDateObj = moment(startDate, DATE_FORMAT_APP)
  }

  if (endDate) {
    endDateObj = moment(endDate, DATE_FORMAT_APP)
  }

  return (
    <div className={'d-inline-block ' + className}>
      <DateRangePicker
        initialVisibleMonth={() => moment().subtract(isDeviceDesktop ? 1 : 0, 'month')}
        disabled={!overview.data?.datesAvailable}
        startDate={startDateObj}
        startDateId={(startDate ?? 'no-start-date') + id + 'start'}
        endDate={endDateObj}
        endDateId={(endDate ?? 'no-end-date') + id + 'end'}
        onDatesChange={({startDate, endDate}) =>
          action(ACTION_CHANGE_DATE_FILTER_INTERVAL, {
            startDate: startDate?.format(DATE_FORMAT_APP) ?? null,
            endDate: endDate?.format(DATE_FORMAT_APP) ?? null,
          })
        }
        focusedInput={dateFilter.focusedInput}
        onFocusChange={focusedInput => action(ACTION_TOGGLE_DATE_FILTER, {focusedInput: focusedInput})}
        enableOutsideDays={false}
        isOutsideRange={date => {
          if (!overview.data?.datesAvailable) {
            return true
          }

          const {datesAvailable} = overview.data
          if (date.isBefore(moment(datesAvailable[0], DATE_FORMAT_APP), 'day')) {
            return true
          }

          if (date.isAfter(moment(datesAvailable.slice(-1)[0], DATE_FORMAT_APP), 'day')) {
            return true
          }

          return false
        }}
        numberOfMonths={isDeviceDesktop ? 2 : 1}
        minimumNights={0}
        firstDayOfWeek={1}
        displayFormat={DATE_FORMAT_APP}
        showDefaultInputIcon={true}
        small={true}
        hideKeyboardShortcutsPanel={true}
      />
    </div>
  )
}

const stateToProps = state => ({
  overview: state.overview,
  isDeviceDesktop: state.theme.isDeviceDesktop,
})

const dispatchToProps = {}

export const DateFilter = connect(stateToProps, dispatchToProps)(DateFilterComponent)
