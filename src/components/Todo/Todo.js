// LIBRARIES
import React from 'react'
import { mdiCheck, mdiDelete } from '@mdi/js'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
import { Input, Icon } from '../'
// INTERNAL COMPONENTS

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

/**
 *
 * @param {object} item - Item to be displayed
 * @param {number} index - Index of the item in a list
 * @param {string} type - Type of the component the todo should be displayed in, ex. 'input'
 * @param {bool} checks - If the todo should have a check of the left side
 * @param {func} handleCheck - Function for when user clicks on the check icon
 * @param {func} handleDelete - Function for when the user clicks on the remove icon
 * @param {func} handleChange - Function for when user changes the vlaue of the todo
 */
const Todo = props => {
  const {
    item,
    handleCheck,
    handleDelete,
    index,
    handleChange,
    type,
    checks
  } = props

  let renderChecks = null
  if (checks) {
    renderChecks = <Icon icon={mdiCheck} onClick={() => handleCheck(index)} />
  }

  let renderTodo = {}
  if (type === 'input') {
    renderTodo = (
      <Input
        name="todoInput"
        value={item.title}
        onChange={evt => handleChange(index, evt)}
      />
    )
  } else {
    renderTodo = <p>{item.title}</p>
  }

  const classes = useStyles()
  return (
    <div
      className={classes.container}
      style={item.checked ? { background: '#55D5C6' } : null}
    >
      {renderChecks}
      {renderTodo}
      <Icon icon={mdiDelete} onClick={() => handleDelete(index)} />
    </div>
  )
}

export default Todo

Todo.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string,
  checks: PropTypes.bool,
  handleCheck: PropTypes.func,
  handleDelete: PropTypes.func,
  handleChange: PropTypes.func
}

Todo.defaultProps = {
  item: { title: 'item', checked: false },
  index: 0,
  type: '',
  checks: true,
  handleCheck: () => console.log('TodoList default handleCheck function'),
  handleDelete: () => console.log('TodoList default handleDelete function'),
  handleChange: () => console.log('TodoList default handleChange function')
}
