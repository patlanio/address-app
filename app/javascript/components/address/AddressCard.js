import React from "react"
import { Link } from "react-router-dom"

function AddressCard(props) {
  return (<div className="card bg-dark overflow-hidden" key={props.id}>
    <img src="https://northstar-pres.com/wp-content/uploads/2015/10/google-map-placeholder.png" className="card-img-top" alt="..." />
    <Link to={`/address/${props.id}`} className="card-img-overlay text-decoration-none text-dark">
      <div className="card-title fs-4">{`${props.street} ${props.ext_num} ${props.int_num}`}</div>
      <div className="card-text fs-6 fw-lighter">
        {`${props.neighborhood} ${props.zipcode}`}
        <br />
        {`${props.city} ${props.state} ${props.country}`}
      </div>
    </Link>
  </div>)
}

export default AddressCard
