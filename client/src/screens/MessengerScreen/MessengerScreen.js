import React, { useState, useEffect, useRef } from 'react'
import MessagesUserToUser from './components/MessagesUserToUser/MessagesUserToUser'
import NewMessage from './components/NewMessage/NewMessage'
import FriendsList from './components/FriendsList/FriendsList'
import { Grid } from '@material-ui/core'
import { observer, inject } from 'mobx-react'
import SVG from '../../fb_logo'
import Header from './components/Header/Header'
import './MessengerScreen.scss'
import Footer from './components/Footer/Footer'
import gql from 'graphql-tag'

import { useQuery, useSubscription } from '@apollo/react-hooks'

const MESSAGES_SUBSCRIPTION = gql`
  subscription onMessageAdded($id: Int!) {
    messageAdded(id: $id) {
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

const MessengerScreen = (props) => {
  const [selectedFriend, setSelectedFriend] = useState()
  const [
    newMessageFromSelectedFriend,
    setNewMessageFromSelectedFriend
  ] = useState('')
  const [newMessagesFrom, setNewMessagesFrom] = useState([])
  const messagesEnd = useRef(null)
  const audio = new Audio('./icq2.mp4')

  const { data } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { id: props.store.user.id }
  })

  useEffect(() => {
    if (data) {
      const { messageAdded } = data
      if (
        messageAdded.from.id === selectedFriend ||
        messageAdded.from.id === props.store.user.id
      ) {
        setNewMessageFromSelectedFriend(messageAdded)
      }
      handleNewMessage(messageAdded)
      playNewMessageAudio(messageAdded)
    }
  }, [data])

  // if the from id is not equal to the currenlty logged in user id then play the sound
  function playNewMessageAudio(messageAdded) {
    messageAdded.from.id !== props.store.user.id && audio.play()
  }

  function scrollToBottom() {
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  }

  function unreadMessagesCount(messages) {
    const totalUnread = messages.reduce(
      (accumulator, msg) => {
        if(msg.id !==props.store.user.id){
          return accumulator + msg.count
        }
        },
      0
    )
    return totalUnread
  }

  function handleNewMessage(newMessage) {
    const newMessagesFromNEW = newMessagesFrom ? [...newMessagesFrom] : []
    if (newMessage && newMessage.from.id !== selectedFriend) {
      const foundMessageFromIndex = newMessagesFromNEW.findIndex(
        (msg) => msg.id === newMessage.from.id
      )
      if (foundMessageFromIndex !== -1) {
        newMessagesFromNEW[foundMessageFromIndex].count++
      } else {
        newMessagesFromNEW.push({ id: newMessage.from.id, count: 1 })
      }
      setNewMessagesFrom(newMessagesFromNEW)
      setTitleUnread(newMessagesFromNEW)
    }
    setTimeout(() => {
      scrollToBottom()
    }, 300)
  }

  function setTitleUnread(messages) {
    const unreadCount = unreadMessagesCount(messages)
    console.log('unreadCount: ', unreadCount);
    if (unreadCount) document.title = `Cracked FB (${unreadCount})`
    else {
      document.title = `Cracked FB`
    }
  }

  function handleSelectFriend(id) {
    const newMessagesFromNEW = newMessagesFrom ? [...newMessagesFrom] : []
    const foundMessageFromIndex = newMessagesFromNEW.findIndex(
      (msg) => msg.id === id
    )
    if (foundMessageFromIndex !== -1) {
      newMessagesFromNEW.splice(foundMessageFromIndex, 1)
      setNewMessagesFrom(newMessagesFromNEW)
    }
    setTitleUnread(newMessagesFromNEW)

    setTimeout(() => {
      scrollToBottom()
    }, 300)

    setSelectedFriend(id)
  }

  return (
    <Grid container>
      <Header />
      <Grid item xs={4}>
        <FriendsList
          selectedFriend={selectedFriend}
          onSelectFriend={(id) => handleSelectFriend(id)}
          user={props.store.user}
          newMessagesFrom={newMessagesFrom}
        />
      </Grid>
      <Grid item xs={8} className="messengerScreenContainer">
        <h3>Messenger</h3>
        <div className="messengerContainer">
          <div className="messages">
            <MessagesUserToUser
              onNewMessage={(newMessage) => handleNewMessage(newMessage)}
              selectedFriend={selectedFriend}
              user={props.store.user}
              newMessage={newMessageFromSelectedFriend}
            />
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={messagesEnd}
            ></div>
          </div>
          <div>
            <NewMessage
              selectedFriend={selectedFriend}
              user={props.store.user}
            />
          </div>
        </div>
      </Grid>
      <Footer />
    </Grid>
  )
}

export default inject('store')(observer(MessengerScreen))
