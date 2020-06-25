const { gql } = require('apollo-server-express')
const { users, messages } = require('./staticData')

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

exports.typeDefs = typeDefs
