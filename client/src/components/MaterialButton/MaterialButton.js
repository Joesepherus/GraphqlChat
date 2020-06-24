// LIBRARIES
import React from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS

/**
 * A Material UI Button
 * @param {element} children - what to display in the button(text)
 * @param {string} color - what color should the button have
 * @param {string} variant - type of button
 * @param {string} size - size of the button
 * @param {function} onClick - function defining what to do when a user presses the button
 * @returns {component} return a Material UI Button with children
 */
const MaterialButton = ({ children, color, variant, isDisabled, onClick }) => (
  <Button
    color={color}
    variant={variant}
    onClick={onClick}
    disabled={isDisabled}
  >
    {children}
  </Button>
)

export default MaterialButton

MaterialButton.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func
}

MaterialButton.defaultProps = {
  children: 'Press me',
  color: 'primary',
  variant: 'contained',
  size: 'medium',
  onClick: () =>
    console.log(
      'Material Button onClick default function: You have pressed the button!'
    )
}
