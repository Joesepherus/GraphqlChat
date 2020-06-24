// LIBRARIES
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import cs from 'classnames'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS

/**
 * Basic input
 * @param {string} value - The value of the input
 * @param {string} [label] - The label of the input
 * @param {function} onChange - The function that fires when user writes to the input
 * @param {string} [multiline] - Specifies if the input should be multiline
 * @param {string} [helperText] - The helpter text is a text that is displayed under the input
 * @param {string} [className] - Custom className styling
 * @param {number} [rows] - Number of rows a multiline input should have
 */
class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {
      value,
      label,
      onChange,
      name,
      multiline,
      className,
      helperText,
      rows
    } = this.props

    return (
      <div className={cs(className)}>
        <TextField
          id={name}
          label={label}
          className={cs(className)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          margin="normal"
          multiline={multiline ? multiline : false}
          rows={rows}
          helperText={helperText}
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    )
  }
}

export default Input

Input.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool,
  helperText: PropTypes.string,
  rows: PropTypes.number
}

Input.defaultProps = {
  className: '',
  value: '',
  label: '',
  onChange: () =>
    console.log(
      'Material Input onChange default function: You have changed the input'
    ),
  multiline: false,
  helperText: '',
  rows: 4
}
