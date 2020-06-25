const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { PubSub, withFilter } = require('graphql-subscriptions')
const cors = require('cors')
const http = require('http')
const pubsub = new PubSub()
const app = express()
app.use(express.static(__dirname + '/client'))
app.use(cors())

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type User {
    id: String
    name: String
    messages: [Message]
    online: Boolean
  }
  type Message {
    id: String
    text: String
    from: User
    to: User
    user: User
  }

  type AddUserResponse {
    user: User
    response: String
  }

  # This type specifies the entry points into our API. In this case
  # there are two. messages and users
  type Query {
    messages: [Message]
    messagesUserToUser(from: String, to: String): [Message]
    friends(id: String): [User]
    user(id: String): User
    onlineUsers(id: String): [User]
  }

  type Mutation {
    addMessage(text: String!, from: String!, to: String!): Message
    addUser(username: String!): AddUserResponse
    logout(username: String!): Boolean
  }

  type Subscription {
    messageAdded(repoFullName: String!, id: String!): Message
    userLoggedIn(repoFullName: String): User
  }
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    messages: (_) => messages,
    messagesUserToUser: (root, { from, to }) => {
      const res = messages.filter(
        (message) =>
          (message.from == from && message.to == to) ||
          (message.to == from && message.from == to)
      )

      return res
    },
    onlineUsers: (root, { id }) => {
      const usersOn = users.filter((user) => user.online && user.id != id)
      return usersOn
    },
    friends: (root, { id }) => {
      let friendsIds = []
      for (const msg of messages) {
        if (msg.from == id) {
          friendsIds.push(msg.to)
        }
        if (msg.to == id) {
          friendsIds.push(msg.from)
        }
      }

      const friends = users.filter((user) => {
        if (friendsIds.includes(user.id)) return user
      })

      return friends
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
        from: from,
        user: from
      }
      messages.push(newMessage)
      pubsub.publish('messageAdded', { messageAdded: newMessage })
      return newMessage
    },
    addUser: (root, { username }) => {
      const foundUserIndex = users.findIndex((user) => user.name === username)

      if (foundUserIndex !== -1) {
        users[foundUserIndex].online = true
        pubsub.publish('userLoggedIn', { userLoggedIn: users[foundUserIndex] })
        return { user: users[foundUserIndex], response: 'Welcome back.' }
      }
      const newUser = { id: users.length, name: username, online: true }
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
  User: {
    messages: (user) => messages.filter((message) => message.user == user.id)
  },
  Message: {
    user: (message) => users.find((user) => user.id == message.user),
    from: (message) => users.find((user) => user.id == message.from),
    to: (message) => users.find((user) => user.id == message.to)
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          //
          //
          //
          return (
            payload.messageAdded.from == variables.id ||
            payload.messageAdded.to == variables.id
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

const messages = [
  { id: 0, text: 'Hello World!', user: 0, to: 0, from: 1 },
  { id: 1, text: 'Hey', user: 1, to: 1, from: 0 },
  { id: 2, text: 'w', user: 1, to: 1, from: 0 },
  { id: 3, text: 'invisble', user: 1, to: 1, from: 2 },
  { id: 4, text: 'hey man how u doing', user: 0, to: 0, from: 2 }
]
const users = [
  { id: 0, name: 'Joes' },
  { id: 1, name: 'Jack' },
  { id: 2, name: 'Julia' }
]

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })

// var expressServer = app.listen(process.env.PORT || 4000, function () {
//   var host = expressServer.address().address
//   var port = expressServer.address().port
//   console.log('🚀App listening at http://%s:%s', host, port)
// })

// // The `listen` method launches a web server.
// server.listen({ port: 4000, cors: true }).then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`)
// })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(process.env.PORT || 4000, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
      server.graphqlPath
    }`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.PORT || 4000}${
      server.subscriptionsPath
    }`
  )
})
