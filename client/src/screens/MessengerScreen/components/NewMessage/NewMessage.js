import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import './NewMessage.scss'
import { mdiSend } from '@mdi/js'
import CustomIcon from '../../../../components/Icon/Icon'

const ADD_MESSAGE = gql`
  mutation addMessage($from: String!, $to: String!, $text: String!) {
    addMessage(from: $from, to: $to, text: $text) {
      id
      text
    }
  }
`
const NewMessage = (props) => {
  const { selectedFriend, user } = props
  const [text, setText] = useState('')
  const [addMessage] = useMutation(ADD_MESSAGE)

  function sendMessage() {
    addMessage({ variables: { from: user.id, to: selectedFriend, text: text } })
    setText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="newMessageContainer">
      <input
        className="newMessageInput"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <CustomIcon icon={mdiSend} color="#009aff" onClick={sendMessage} />
    </div>
  )
}

export default NewMessage
