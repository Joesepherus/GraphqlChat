const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const http = require('http')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')

const app = express()
app.use(express.static(__dirname + '/client'))
app.use(cors())

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })
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
