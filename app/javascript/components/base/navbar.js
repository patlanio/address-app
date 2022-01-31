import React from "react"
import { Link } from "react-router-dom"

function Navbar(props) {
  return (<nav className="navbar navbar-dark bg-primary px-4">
    <div className="container-fluid px-4">
      <Link className="navbar-brand" to="/">
        <img src="https://www.iconpacks.net/icons/1/free-address-book-icon-1026-thumb.png" alt="" width="30" height="24" className="d-inline-block align-text-top" />
        All
      </Link>
      <div className="d-flex">
        <Link to="/new" className="btn btn-light">New</Link>
      </div>
    </div>
  </nav>)
}

export default Navbar
