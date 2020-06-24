// LIBRARIES
import React, { Fragment } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS
import 'react-datepicker/dist/react-datepicker.css'
/**
 *
 * @param {object} selectedDate - Date that is displayed on the Datepicker
 * @param {func} onChange - Function for when user picks a new date
 * @param {bool} timeOnly - If true Datepicker will only display time
 * @param {string} placement - Describes where the Datepicker popup will be opened
 */
const CustomDatePicker = props => {
  const { selectedDate, onChange, timeOnly, placement } = props
  console.log('props: ', props)
  let otherProps = {}
  if (!timeOnly)
    otherProps = {
      showYearDropdown: true,
      scrollableYearDropdown: true,
      peekNextMonth: true,
      showWeekNumbers: true,
      dateFormat: 'LL',
      yearDropdownItemNumber: 3
    }
  else
    otherProps = {
      showTimeSelect: true,
      showTimeSelectOnly: true,
      dateFormat: 'h:mm aa',
      timeCaption: 'Time'
    }
  return (
    <Fragment>
      <DatePicker
        locale="de"
        popperPlacement={placement}
        // minDate={new Date()}
        selected={selectedDate}
        value={selectedDate}
        onChange={date => {
          onChange(date)
        }}
        // {...otherProps}
      />
    </Fragment>
  )
}

export default CustomDatePicker

CustomDatePicker.propTypes = {
  selectedDate: PropTypes.object,
  onChange: PropTypes.func,
  timeOnly: PropTypes.bool,
  placement: PropTypes.string
}

CustomDatePicker.defaultProps = {
  selectedDate: new Date(),
  onChange: () => console.log('CustomDatePicker default onChange function'),
  timeOnly: false,
  placement: 'top'
}
