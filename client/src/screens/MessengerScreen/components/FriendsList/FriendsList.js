import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import './FriendsList.scss'
import { mdiAccount } from '@mdi/js'
import CustomIcon from '../../../../components/Icon/Icon'

const onlineUsersQuery = gql`
  query onlineUsers($id: Int!) {
    onlineUsers(id: $id) {
      id
      name
    }
  }
`

const USER_LOGGED_IN_SUBSCRIPTION = gql`
  subscription onUserLoggedIn {
    userLoggedIn {
      id
      name
      online
    }
  }
`
const FriendList = (props) => {
  const { onSelectFriend, selectedFriend, user, newMessagesFrom } = props

  const [onlineUsers, setOnlineUsers] = useState([])
  const { data, refetch } = useQuery(onlineUsersQuery, {
    variables: { id: user.id }
  })
  const { data: newUser } = useSubscription(USER_LOGGED_IN_SUBSCRIPTION)

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    let onlineUsersNew = []
    if (data) {
      onlineUsersNew = [...data.onlineUsers]
    }
    setOnlineUsers(onlineUsersNew)
  }, [data])

  useEffect(() => {
    if (newUser) {
      if (newUser.userLoggedIn.online) {
        let onlineUsersNew = [...onlineUsers]
        onlineUsersNew.push({ ...newUser.userLoggedIn })
        setOnlineUsers(onlineUsersNew)
      } else {
        let onlineUsersNew = [...onlineUsers]
        const userIndex = onlineUsersNew.findIndex(
          (user) => user.id == newUser.userLoggedIn.id
        )
        if (userIndex !== -1) {
          onlineUsersNew.splice(userIndex, 1)
          setOnlineUsers(onlineUsersNew)
        }
      }
    }
  }, [newUser])

  return (
    <div className="friendsListContainer">
      <h3>Currently online</h3>
      {onlineUsers && onlineUsers.length > 0
        ? onlineUsers.map((friend) => {
            const friendListClass =
              selectedFriend === friend.id
                ? 'friendListItem active'
                : 'friendListItem'
            const newMessages =
              newMessagesFrom &&
              newMessagesFrom.find((message) => message.id == friend.id)
            console.log('newMessages: ', newMessages)
            return (
              <div
                className={friendListClass}
                onClick={() => onSelectFriend(friend.id)}
              >
                <CustomIcon icon={mdiAccount} />{' '}
                <p className="friendName">{friend.name}</p>
                {newMessages ? (
                  <p className="newMessages">{newMessages.count}</p>
                ) : null}
              </div>
            )
          })
        : null}
    </div>
  )
}

export default FriendList
