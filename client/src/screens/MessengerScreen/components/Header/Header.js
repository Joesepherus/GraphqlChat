import React from 'react'
import { Grid } from '@material-ui/core'
import Menu from '../../../../components/Menu/Menu'
import { observer, inject } from 'mobx-react'
import SVG from '../../../../fb_logo'
import './Header.scss'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const LOGOUT = gql`
  mutation logout($username: String!) {
    logout(username: $username)
  }
`

const Header = (props) => {
  const [logout] = useMutation(LOGOUT)

  function onLogout() {
    logout({ variables: { username: props.store.user.name } })
  }

  return (
    <Grid container className="header">
      <Grid item xs={4} className="center headerLeft">
        <SVG />
        <p className="logoText">Cracked Facebook</p>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={2} className="center headerRight">
        <Menu buttonText={props.store.user.name} onLogout={onLogout} />
      </Grid>
    </Grid>
  )
}

export default inject('store')(observer(Header))
