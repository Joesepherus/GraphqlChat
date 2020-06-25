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
    id: Int
    name: String
    messages: [Message]
    online: Boolean
  }
  type Message {
    id: Int
    text: String
    from: User
    to: User
  }

  type LoginResponse {
    user: User
    response: String
  }

  # This type specifies the entry points into our API. In this case
  # there are two. messages and users
  type Query {
    messages: [Message]
    messagesUserToUser(from: Int, to: Int): [Message]
    user(id: Int): User
    onlineUsers(id: Int): [User]
  }

  type Mutation {
    addMessage(text: String!, from: Int!, to: Int!): Message
    login(username: String!): LoginResponse
    logout(username: String!): Boolean
  }

  type Subscription {
    messageAdded(id: Int!): Message
    userLoggedIn: User
  }
`

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

const messages = [
  { id: 1, text: 'Hello World!', to: 1, from: 2 },
  { id: 2, text: 'Hey', to: 2, from: 1 },
  { id: 3, text: 'w', to: 2, from: 1 },
  { id: 4, text: 'invisble', to: 2, from: 3 },
  { id: 5, text: 'hey man how u doing', to: 1, from: 3 }
]
const users = [
  { id: 1, name: 'Joes' },
  { id: 2, name: 'Jack' },
  { id: 3, name: 'Julia' }
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
