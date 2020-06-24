import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

export default class CustomToast extends Component {
  notify = msg =>
    toast.info(msg, {
      position: toast.POSITION.BOTTOM_LEFT
    })

  render() {
    return <ToastContainer />
  }
}
