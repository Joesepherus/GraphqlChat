// LIBRARIES
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import cs from 'classnames'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
import textInputStyles from './styles.scss'
// INTERNAL COMPONENTS

const styles = (theme) => ({
  input: {
    width: '100%',
    marginTop: '0px'
  }
})

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
      classes,
      className,
      helperText,
      rows,
      keyPress,
      onKeyPress
    } = this.props

    return (
      <div className={cs(textInputStyles.textInput, className)}>
        <TextField
          id={name}
          label={label}
          className={cs(textInputStyles.textField, classes.input, className)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          margin="normal"
          multiline={multiline ? multiline : false}
          rows={rows}
          helperText={helperText}
          // variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          onKeyPress={(ev) => {
            if (ev.key === keyPress) {
              ev.preventDefault()
              onKeyPress()
            }
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Input)

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
  onChange: () => console.log('onChange default function'),
  multiline: false,
  helperText: '',
  rows: 4
}
