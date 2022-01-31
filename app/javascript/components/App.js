import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddressForm from './AddressForm'
import AddressList from './AddressList'
import Navbar from './base/navbar'

function App(props) {
  return (<BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path="new" element={<AddressForm />} />
      <Route path="/" element={<AddressList />}></Route>
      <Route path="/address/:addressId" element={<AddressForm />} />
    </Routes>
  </BrowserRouter>)
}

export default App
