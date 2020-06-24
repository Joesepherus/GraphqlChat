import React from 'react'
import { Grid } from '@material-ui/core'
import './Footer.scss'

const Footer = () => {
  return (
    <Grid container className="footer">
      <Grid
        item
        xs={12}
        style={{ height: '30px', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        created by Joesepherus
      </Grid>
    </Grid>
  )
}

export default Footer
