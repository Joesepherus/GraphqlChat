// LIBRARIES
import React from 'react'
import Icon from '@mdi/react'
import { mdiAccountCircle } from '@mdi/js'
import { PropTypes } from 'prop-types'
// GLOBAL COMPONENTS
// INTERNAL COMPONENTS

/**
 * Icon component
 * @param {string} className - Custom className styling
 * @param {object} icon - Element for being displayed as an icon
 * @param {number} size - Describes size of the icon
 * @param {string} color - Describes the color of the icon
 * @param {func} onClick - Function for when the use clicks on the icon
 */
const CustomIcon = (props) => {
  const { className, icon, size, color, onClick } = props

  return (
    <div className={className}>
      <Icon className={className ? className : ''} path={icon} size={size} color={color} onClick={onClick} />
    </div>
  )
}

export default CustomIcon

CustomIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  onClick: PropTypes.func
}

CustomIcon.defaultProps = {
  className: '',
  icon: mdiAccountCircle,
  size: 1,
  color: 'black',
  onClick: () => console.log('Icon default onClick function')
}
