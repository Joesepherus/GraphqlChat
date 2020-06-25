import { decorate, observable, action } from 'mobx'
import { showToast, setLoginStatus } from '../global/global'

import gql from 'graphql-tag'
import { client } from '../App'

class store {
  loggedIn = false
  user = {}

  setLoggedIn(status) {
    this.loggedIn = status
  }

  async login(data) {
    if (data) {
      console.log('login data: ', data)
      this.user = data.user
      setLoginStatus(true, data.user.id)
      showToast(data.response, 'info')
    }
  }

  async logout() {
    this.user = null
    setLoginStatus(false)
    showToast('You were logged out.', 'info')
  }

  async getUser(userId) {
    let user
    await client
      .query({
        query: gql`
          query getUser($id: Int!) {
            user(id: $id) {
              id
              name
            }
          }
        `,
        variables: { id: parseInt(userId) }
      })
      .then((response) => {
        user = response.data.user
        console.log('response.data', response.data)
        if (user) {
          this.user = user
          this.setLoggedIn(true)
        } else {
          setLoginStatus(false)
        }
      })
    console.log('user: ', user)
    return user
  }
}

decorate(store, {
  loggedIn: observable,
  user: observable,
  setLoggedIn: action,
  login: action,
  getUser: action
})

export default new store()
