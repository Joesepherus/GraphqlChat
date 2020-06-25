import React, { useState, useEffect } from 'react'
import MaterialInput from '../../components/MaterialInput/MaterialInput'
import MaterialButton from '../../components/MaterialButton/MaterialButton'
import cs from 'classnames'
import './styles.scss'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { observer, inject } from 'mobx-react'

const ADD_USER = gql`
  mutation login($username: String!) {
    login(username: $username) {
      user {
        id
        name
      }
      response
    }
  }
`

const LoginPage = (props) => {
  const [username, setUsername] = useState('')
  const [login, { data }] = useMutation(ADD_USER)

  useEffect(() => {
    if (data && data.login.user) {
      props.store.login(data.login)
    }
  }, [data])

  function startChat() {
    if (username !== '') {
      login({ variables: { username: username } })
      setUsername('')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      startChat()
    }
  }

  return (
    <div className={cs('loginContainer')}>
      <div>
        <h2>Messenger</h2>
        <MaterialInput
          label="username"
          value={username}
          onChange={(value) => setUsername(value)}
          onKeyDown={handleKeyDown}
        />
        <MaterialButton onClick={() => startChat()}>start chat</MaterialButton>
      </div>
    </div>
  )
}

export default inject('store')(observer(LoginPage))
