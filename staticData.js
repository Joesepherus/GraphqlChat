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

exports.users = users
exports.messages = messages
