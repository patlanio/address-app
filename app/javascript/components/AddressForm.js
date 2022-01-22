import React from "react"
import PropTypes from "prop-types"

class AddressForm extends React.Component {
  render () {
    return (
      <React.Fragment>
        <h1>Dirección</h1>
        <ul>
          <li>street: { this.props.street }</li>
          <li>ext_num: { this.props.ext_num }</li>
          <li>int_num: { this.props.int_num }</li>
          <li>zipcode: { this.props.zipcode }</li>
          <li>neighborhood: { this.props.neighborhood }</li>
          <li>city: { this.props.city }</li>
          <li>state: { this.props.state }</li>
          <li>country: { this.props.country }</li>
        </ul>
      </React.Fragment>
    );
  }
}

export default AddressForm
