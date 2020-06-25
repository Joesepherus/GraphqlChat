const { gql } = require('apollo-server-express')
const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { users, messages } = require('./staticData')

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    messagesUserToUser: (root, { from, to }) => {
      const res = messages.filter(
        (message) =>
          (message.from === from && message.to === to) ||
          (message.to === from && message.from === to)
      )

      return res
    },
    onlineUsers: (root, { id }) => {
      const usersOn = users.filter((user) => user.online && user.id != id)
      return usersOn
    },
    user: (root, { id }) => users.find((user) => user.id == id)
  },
  Mutation: {
    addMessage: (root, { text, from, to }) => {
      // const fromUser = users.find((db_user) => db_user.id == from)
      // const toUser = users.find((db_user) => db_user.id == to)
      const newMessage = {
        id: messages.length + 1,
        text: text,
        to: to,
        from: from
      }
      messages.push(newMessage)
      pubsub.publish('messageAdded', { messageAdded: newMessage })
      return newMessage
    },
    login: (root, { username }) => {
      const foundUserIndex = users.findIndex((user) => user.name === username)

      if (foundUserIndex !== -1) {
        users[foundUserIndex].online = true
        pubsub.publish('userLoggedIn', { userLoggedIn: users[foundUserIndex] })
        return { user: users[foundUserIndex], response: 'Welcome back.' }
      }
      const newUser = { id: users.length + 1, name: username, online: true }
      users.push(newUser)
      pubsub.publish('userLoggedIn', { userLoggedIn: newUser })

      return { user: newUser, response: 'User created successfuly.' }
    },
    logout: (root, { username }) => {
      const foundUserIndex = users.findIndex((user) => user.name === username)
      users[foundUserIndex].online = false

      if (foundUserIndex !== -1) {
        pubsub.publish('userLoggedIn', { userLoggedIn: users[foundUserIndex] })
        // return { user: users[foundUserIndex], response: 'You were successfuly logged.' }
      }
    }
  },
  Message: {
    from: (message) => users.find((user) => user.id == message.from),
    to: (message) => users.find((user) => user.id == message.to)
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          // console.log('variables: ', variables)
          // console.log('payload: ', payload)
          return (
            payload.messageAdded.from === variables.id ||
            payload.messageAdded.to === variables.id
          )
        }
      )
    },
    userLoggedIn: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('userLoggedIn'),
        (payload, variables) => {
          return true
        }
      )
    }
  }
}

exports.resolvers = resolvers
