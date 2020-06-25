import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Message from '../Message/Message'

const messagesListQuery = gql`
  query messagesUserToUser($from: Int, $to: Int) {
    messagesUserToUser(from: $from, to: $to) {
      id
      text
      from {
        id
        name
      }
      to {
        id
        name
      }
    }
  }
`

const MessageUserToUser = (props) => {
  const { selectedFriend, user, onNewMessage, newMessage } = props
  const [messages, setMessages] = useState([])
  const { loading, error, data, refetch } = useQuery(messagesListQuery, {
    variables: { from: user.id, to: selectedFriend }
  })

  useEffect(() => {
    refetch()
  }, [selectedFriend])

  useEffect(() => {
    let messagesDB = []
    if (data) {
      messagesDB = [...data.messagesUserToUser]
    }
    setMessages(messagesDB)
    setTimeout(() => {
      onNewMessage()
    }, 100)
  }, [data])

  useEffect(() => {
    if (newMessage) {
      let messagesDB = [...messages]
      messagesDB.push({ ...newMessage })
      setMessages(messagesDB)
    }
  }, [newMessage])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    messages.length > 0 &&
    messages.map((message, index) => (
      <Message
        message={message}
        selectedFriend={selectedFriend}
        prevFrom={index > 0 && messages[index - 1]}
      />
    ))
  )
}

export default MessageUserToUser
