import React from 'react'
import './Message.scss'

const Message = (props) => {
  const { message, selectedFriend, prevFrom } = props

  if (message.from.id === selectedFriend) {
    return (
      <div className="message">
        {prevFrom && prevFrom.from.id === message.from.id ? null : (
          <div className="username">{message.from.name}</div>
        )}
        <div className="messageLeft">
          <div className="messageTextFriend">{message.text}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="message">
        {prevFrom && prevFrom.from.id === message.from.id ? null : (
          <div className="username messageRight">{message.from.name}</div>
        )}
        <div className="messageRight">
          <div className="messageTextUser">{message.text}</div>
        </div>
      </div>
    )
  }
}

export default Message
