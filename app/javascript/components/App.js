import React from "react"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddressForm from './AddressForm'
import AddressList from './AddressList'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addressses: [],
      ...props
    }
  }

  render() {
    return (<BrowserRouter>
      <Routes>
        <Route path="new" element={<AddressForm />} />
        <Route path="/" element={<AddressList />}></Route>
        <Route path="/address/:addressId" element={<AddressForm />} />
      </Routes>
    </BrowserRouter>)
  }
}

export default App
