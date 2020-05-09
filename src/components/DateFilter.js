import moment from 'moment'
import React, {Component} from 'react'
import {DateRangePicker} from 'react-dates'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {ACTION_CHANGE_DATE_FILTER_INTERVAL, DATE_FORMAT_APP} from '../global/constants'
import {action} from '../global/util'

class DateFilterComponent extends Component {
  constructor() {
    super()

    this.state = {
      datePickerFocus: null,
    }
  }

  render() {
    const {overview, className, id} = this.props
    const {dateFilter} = overview
    const startDate = dateFilter.startDate || null
    const endDate = dateFilter.endDate || null
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
          initialVisibleMonth={() => moment().subtract(1, 'month')}
          disabled={!overview.data?.datesAvailable}
          startDate={startDateObj}
          startDateId={(startDate || 'no-start-date') + id + 'start'}
          endDate={endDateObj}
          endDateId={(endDate || 'no-end-date') + id + 'end'}
          onDatesChange={({startDate, endDate}) =>
            action(ACTION_CHANGE_DATE_FILTER_INTERVAL, {
              startDate: startDate?.format(DATE_FORMAT_APP) || null,
              endDate: endDate?.format(DATE_FORMAT_APP) || null,
            })
          }
          focusedInput={this.state.datePickerFocus}
          onFocusChange={focusedInput => this.setState({datePickerFocus: focusedInput})}
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
}

const stateToProps = state => ({
  overview: state.overview,
})

const dispatchToProps = {}

export const DateFilter = withRouter(connect(stateToProps, dispatchToProps)(withTranslation()(DateFilterComponent)))
