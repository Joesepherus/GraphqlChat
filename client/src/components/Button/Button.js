// LIBRARIES
import React from 'react'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS

/**
 * A basic button component
 * @param {element} children - what to display in the button(text)
 * @param {function} onClick - function defining what to do when a user presses the button
 * @returns {component} return basic html Button with children
 */
const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

export default Button

Button.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func
}

Button.defaultProps = {
  children: 'Press me',
  onClick: () =>
    console.log('Button onClick default function: You have pressed the button!')
}
