import React from 'react'
import './App.css'
import { ApolloProvider } from '@apollo/react-hooks'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import Router from './Router'

// Maybe later move to a seperate config file for apollo client
const wsLink = new WebSocketLink({
  uri: `ws://192.168.1.17:4000/graphql`,
  options: {
    reconnect: true
  }
})

const httpLink = new HttpLink({
  uri: 'http://192.168.1.17:4000/',
  credentials: 'same-origin'
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router />
      </div>
    </ApolloProvider>
  )
}

export default App