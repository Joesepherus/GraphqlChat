import React, { Component } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen/LoginScreen'
import { observer, inject } from 'mobx-react'
import CustomToast from './components/CustomToast/CustomToast'
// import ScreensContainer from './components/containers/ScreensContainer/ScreensContainer'
import history from './history'
import MessengerScreen from './screens/MessengerScreen/MessengerScreen'

class CustomRouter extends Component {
  async componentDidMount() {
    if (this.isLogged()) {
      await this.props.store.getUser(localStorage.getItem('id'))
    }
  }

  isLogged() {
    return localStorage.getItem('logged') === 'true'
  }

  render() {
    return (
      <div className="App">
        <Router history={history}>
          {this.props.store.loggedIn ? (
            <MessengerScreen />
          ) : (
            <Switch>
              <Route exact path="/" component={LoginScreen} />
              <Route path="/login" component={LoginScreen} />
            </Switch>
          )}
        </Router>
        <CustomToast />
      </div>
    )
  }
}

export default inject('store')(observer(CustomRouter))
