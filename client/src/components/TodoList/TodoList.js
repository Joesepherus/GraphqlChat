// LIBRARIES
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
// GLOBAL COMPONENTS
import { Input, Todo, MaterialButton } from '../'
// INTERNAL COMPONENTS

/**
 * TodoList component for storing todos
 * @param {array} todos - Array of todos to display
 * @param {function} handleSave - Function for saving todos
 * @param {string} type - Type of the todolist , ex.'ordered'
 * @param {bool} checks - If the todos should have an icon check
 */
class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todoInput: '',
      todos: this.props.todos
    }
  }

  // function for changing this.state.todoInput
  handleInputChange = (name, value) => {
    this.setState({ [name]: value })
  }

  // function for changing this.state.todos
  handleTodoChange = (index, value) => {
    const { todos } = this.state
    const { handleSave } = this.props

    let newTodos = [...todos]
    newTodos[index].title = value

    this.setState({ todos: newTodos })
    if (handleSave) {
      handleSave(newTodos)
    }
  }

  // function for adding new todos
  handleAddTodo = () => {
    const { todos, todoInput } = this.state
    const { handleSave, type } = this.props

    if (todoInput.length <= 0) return
    let newTodos = [...todos]
    // if ordered, then put the todo at the end of the list, if not then put it at the beginning
    if (type === 'ordered') {
      newTodos.push({ checked: false, title: todoInput })
    } else {
      newTodos.unshift({ checked: false, title: todoInput })
    }
    this.setState({
      todoInput: '',
      todos: newTodos
    })

    if (handleSave) {
      handleSave(newTodos)
    }
  }

  // function for setting a checked field of a todo at index from the this.state.todos
  handleCheck = index => {
    const { todos } = this.state
    const { handleSave } = this.props

    let newTodos = [...todos]
    newTodos[index].checked = !newTodos[index].checked
    this.setState({
      todos: newTodos
    })

    if (handleSave) {
      handleSave(newTodos)
    }
  }

  // function for deleting a todo at index from this.state.todos
  handleDelete = index => {
    const { todos } = this.state
    const { handleSave } = this.props

    let newTodos = [...todos]
    newTodos.splice(index, 1)
    this.setState({
      todos: newTodos
    })

    if (handleSave) {
      handleSave(newTodos)
    }
  }

  // function for rendering todos
  // type either 'ordered' or default
  // and either with input or text only
  renderTodos = () => {
    const { type, checks } = this.props
    const { todos } = this.state
    switch (type) {
      case 'ordered':
        return (
          <ol>
            {todos.map((todo, index) => (
              <li>
                <Todo
                  key={index}
                  item={todo}
                  index={index}
                  handleCheck={this.handleCheck}
                  handleDelete={this.handleDelete}
                  handleChange={this.handleTodoChange}
                  type="input"
                  checks={checks}
                />
              </li>
            ))}
          </ol>
        )
      default:
        return todos.map((todo, index) => (
          <Todo
            key={index}
            item={todo}
            index={index}
            handleCheck={this.handleCheck}
            handleDelete={this.handleDelete}
            checks={checks}
          />
        ))
    }
  }

  render() {
    const { todoInput } = this.state
    return (
      <Fragment>
        <Input
          name="todoInput"
          value={todoInput}
          onChange={evt => this.handleInputChange('todoInput', evt)}
          onKeyPress={this.handleAddTodo}
          keyPress="Enter"
        />
        <MaterialButton
          onClick={this.handleAddTodo}
          isDisabled={todoInput.length > 0 ? false : true}
        >
          Add
        </MaterialButton>
        {this.renderTodos()}
      </Fragment>
    )
  }
}

export default TodoList

TodoList.propTypes = {
  todos: PropTypes.array,
  handleSave: PropTypes.func,
  checks: PropTypes.bool,
  type: PropTypes.string
}

TodoList.defaultProps = {
  todos: [],
  type: '',
  checks: false,
  handleSave: () => console.log('TodoList default handleSave function')
}
