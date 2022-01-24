import React from "react"
import PropTypes from "prop-types"

class AddressForm extends React.Component {
  render () {
    return (
      <React.Fragment>
        <div className="container" style={{maxWidth: 300}}>
          <div className="row justify-content-between align-items-start">
            <div className="col-8">
              <h1>Dirección</h1>
            </div>
            <div className="col-4">
              <select className="form-select">
                {this.props.countries.map((country, i) =>
                  (<option value={country.id} key={country.id} style={{backgroundImage: `url(${country.flagUrl})`}}>
                    {country.name}
                  </option>))
                }
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Calle" aria-label="Calle" value={ this.props.address.street } />
                <input type="text" className="form-control" placeholder="Número exterior" aria-label="Número exterior" value={ this.props.address.num_ext } />
                <input type="text" className="form-control" placeholder="Número interior" aria-label="Número interior" value={ this.props.address.num_int }/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <span className="input-group-text">CP</span>
                <input type="text" className="form-control" placeholder="64000" aria-label="Código postal" value={ this.props.address.zipcode } />
                <select className="form-select" disabled={!!this.props.neighborhood}>
                  <option defaultValue>Colonia</option>
                  <option value="1">Centro</option>
                  <option value="2">Contry</option>
                  <option value="3">Del Valle</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <figure className="text-end">
                <figcaption className="blockquote-footer">
                  <cite title={`${this.props.address.city}, ${this.props.address.state}, ${this.props.address.country}`}>
                    {`${this.props.address.city}, ${this.props.address.state}, ${this.props.address.country}`}
                  </cite>
                </figcaption>
              </figure>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
        <ul>
          <li>street: { this.props.address.street }</li>
          <li>ext_num: { this.props.address.ext_num }</li>
          <li>int_num: { this.props.address.int_num }</li>
          <li>zipcode: { this.props.address.zipcode }</li>
          <li>neighborhood: { this.props.address.neighborhood }</li>
          <li>city: { this.props.address.city }</li>
          <li>state: { this.props.address.state }</li>
          <li>country: { this.props.address.country }</li>
        </ul>
      </React.Fragment>
    );
  }
}

export default AddressForm
