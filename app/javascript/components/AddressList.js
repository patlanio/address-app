import React from "react"
import { Link } from 'react-router-dom'

class AddressList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addresses: []
    }
  }

  fetchAddresses() {
    fetch(`/v1/addresses/`)
      .then(response => response.json())
      .then(data => {
        this.setState(state => ({
          addresses: data || []
        }))
      })
  }

  componentWillMount() {
    this.fetchAddresses()
  }

  render() {
    const availableAddresses = this.state.addresses.length > 0

    return (<table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Address</th>
          <th scope="col">Neighborhood</th>
          <th scope="col">Zipcode</th>
          <th scope="col">City</th>
          <th scope="col">State</th>
          <th scope="col">Country</th>
          <th scope="col">
            <Link to="/new">
              <button type="button" className="btn btn-primary">Nueva</button>
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          availableAddresses ? this.state.addresses.map(address =>
            (<tr key={address.id}>
              <th scope="row">{address.id}</th>
              <td>{`${address.street} ${address.ext_num} ${address.int_num}`}</td>
              <td>{address.neighborhood}</td>
              <td>{address.zipcode}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.country}</td>
            </tr>))
          :
            (<tr><td>No hay direcciones</td></tr>)
        }
      </tbody>
    </table>)
  }
}

export default AddressList