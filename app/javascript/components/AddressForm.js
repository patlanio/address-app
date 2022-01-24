import React from "react"
import PropTypes from "prop-types"

class AddressForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      neighborhoods: [],
      ...props
    }
  }

  render () {
    const availableNeighborhoods = this.state.neighborhoods.length > 0

    return (
      <React.Fragment>
        <div className="container" style={{maxWidth: 300}}>
          <div className="row justify-content-between align-items-start">
            <div className="col-8">
              <h1>Dirección</h1>
            </div>
            <div className="col-4">
              <select className="form-select">
                {this.state.countries.map((country, i) =>
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
                <input type="text" className="form-control" placeholder="Calle" aria-label="Calle" value={ this.state.address.street } />
                <input type="text" className="form-control" placeholder="Número exterior" aria-label="Número exterior" value={ this.state.address.num_ext } />
                <input type="text" className="form-control" placeholder="Número interior" aria-label="Número interior" value={ this.state.address.num_int }/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <span className="input-group-text">CP</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="64000"
                  aria-label="Código postal"
                  onChange={() => false }
                  value={ this.state.address.zipcode } />
                <select
                  className="form-select"
                  disabled={!availableNeighborhoods}
                  onChange={() => false } >
                  {
                    availableNeighborhoods ? this.state.neighborhoods.map(neighborhood =>
                      (<option value={neighborhood} key={neighborhood}>
                        {neighborhood}
                      </option>))
                    :
                      (<option>Colonia</option>)
                  }
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <figure className="text-end">
                <figcaption className="blockquote-footer">
                  <cite title={`${this.state.address.city}, ${this.state.address.state}, ${this.state.address.country}`}>
                    {
                      this.state.address.zipcode && this.state.address.neighborhood ?
                      `${this.state.address.city}, ${this.state.address.state}, ${this.state.address.country}` :
                      'Introduce un código postal válido'
                    }
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
          <li>street: { this.state.address.street }</li>
          <li>ext_num: { this.state.address.ext_num }</li>
          <li>int_num: { this.state.address.int_num }</li>
          <li>zipcode: { this.state.address.zipcode }</li>
          <li>neighborhood: { this.state.address.neighborhood }</li>
          <li>city: { this.state.address.city }</li>
          <li>state: { this.state.address.state }</li>
          <li>country: { this.state.address.country }</li>
        </ul>
      </React.Fragment>
    );
  }
}

AddressForm.prototypes = {
  address: PropTypes.object,
  countries: PropTypes.array
}

export default AddressForm
