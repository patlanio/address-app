import React from "react"
import PropTypes from "prop-types"

class AddressForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      neighborhoods: [],
      address: {},
      errors: {},
      fetchingZipCodeRelatedData: false,
      ...props
    }
  }

  fetchNeighborhoods(country, zipcode) {
    fetch(`/v1/addresses/neighborhoods?country=${country}&zipcode=${zipcode}`)
      .then(response => response.json())
      .then(data => {
        const fetchedNeighborhoods = data.neighborhoods || []
        this.setState(state => ({
          neighborhoods: fetchedNeighborhoods,
          fetchingZipCodeRelatedData: false,
          address: {
            ...state.address,
            neighborhood: fetchedNeighborhoods[0],
            state: data.state,
            city: data.city
          }
        }))
      })
  }

  handleNeighborhoodChange (neighborhood) {
    this.setState(state => ({
      fetchingZipCodeRelatedData: false,
      address: {
        ...state.address,
        neighborhood: neighborhood,
      }
    }))
  }

  handleZipCodeChange (zipcode) {
    const country = this.state.countries.find(country => country.name === this.state.address.country) || this.state.countries[0]

    this.setState(state => ({
      fetchingZipCodeRelatedData: true,
      address: {
        ...state.address,
        zipcode: zipcode,
        neighborhood: null,
        country: country.name,
      }
    }), () => this.fetchNeighborhoods(country.name, zipcode))
  }

  handleStreetChange(street) {
    this.setState(state => ({
      address: {
        ...state.address,
        street: street,
      }
    }))
  }

  handleExtNumChange(ext_num) {
    this.setState(state => ({
      address: {
        ...state.address,
        ext_num: ext_num,
      }
    }))
  }

  handleIntNumChange(int_num) {
    this.setState(state => ({
      address: {
        ...state.address,
        int_num: int_num,
      }
    }))
  }

  handleSumbit(e) {
    e.preventDefault()

    this.setState(state => ({
      errors: {}
    }), () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(this.state.address)
      }

      fetch('/v1/addresses', requestOptions)
        .then(async response => {
          const data = await response.json()

          if (response.status !== 200) return Promise.reject(data)

          this.setState(state => ({
            address: {
              ...state.address,
              ...data
            },
            errors: {}
          }))
        })
        .catch(errors => {
          this.setState({ errors: errors })
      })
    })
  }

  render () {
    const availableNeighborhoods = this.state.neighborhoods.length > 0

    return (
      <React.Fragment>
        <form
          onSubmit={(e) => this.handleSumbit(e) }
          className="container"
          ref={this.form}
          style={{maxWidth: 300}}
          >
          <div className="row justify-content-between align-items-start">
            <div className="col-8">
              <h2>Dirección</h2>
            </div>
            <div className="col-4">
              <select
                required
                alt={this.state.errors.country || 'País'}
                className={`form-select mb-3 ${this.state.errors.country && 'is-invalid'}`}>
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
                <input type="text" required placeholder="Calle" aria-label="Calle"
                  className={`form-control ${this.state.errors.street && 'is-invalid'}`}
                  alt={this.state.errors.street || 'Calle'}
                  value={ this.state.address.street }
                  onChange={(e) => this.handleStreetChange(e.target.value) } />
                <input type="text" required placeholder="Número exterior" aria-label="Número exterior"
                  className={`form-control ${this.state.errors.num_ext && 'is-invalid'}`}
                  alt={this.state.errors.num_ext || 'Número exterior'}
                  value={ this.state.address.ext_num }
                  onChange={(e) => this.handleExtNumChange(e.target.value) } />
                <input type="text" required placeholder="Número interior" aria-label="Número interior"
                  className={`form-control ${this.state.errors.num_int && 'is-invalid'}`}
                  alt={this.state.errors.num_int || 'Número interior'}
                  value={ this.state.address.int_num }
                  onChange={(e) => this.handleIntNumChange(e.target.value) } />
                { (this.state.errors.street || this.state.errors.ext_num) &&
                  <div className="invalid-tooltip">{[this.state.errors.street, this.state.errors.ext_num].join(', ')}</div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <span className="input-group-text">CP</span>
                <input
                  required
                  type="text"
                  className={`form-control ${this.state.errors.zipcode && 'is-invalid'}`}
                  placeholder="64000"
                  aria-label="Código postal"
                  alt={this.state.errors.zipcode || 'Código postal'}
                  disabled={this.state.fetchingZipCodeRelatedData}
                  onChange={(e) => this.handleZipCodeChange(e.target.value) }
                  value={ this.state.address.zipcode } />
                <select
                  required
                  className={`form-control ${this.state.errors.neighborhood && 'is-invalid'}`}
                  alt={this.state.errors.neighborhood || 'Colonia'}
                  disabled={!availableNeighborhoods}
                  onChange={(e) => this.handleNeighborhoodChange(e.target.value) } >
                  {
                    availableNeighborhoods ? this.state.neighborhoods.map(neighborhood =>
                      (<option value={neighborhood} key={neighborhood}>
                        {neighborhood}
                      </option>))
                    :
                      (<option>Colonia</option>)
                  }
                </select>
                { (this.state.errors.zipcode || this.state.errors.neighborhood) &&
                  <div className="invalid-tooltip">{[this.state.errors.zipcode, this.state.errors.neighborhood].join(', ')}</div>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <figure className="text-end">
                <figcaption className="blockquote-footer">
                  <cite title={`${this.state.address.city}, ${this.state.address.state}`}>
                    {
                      this.state.address.zipcode && this.state.address.neighborhood ?
                      `${this.state.address.city}, ${this.state.address.state}` :
                      this.state.fetchingZipCodeRelatedData ?
                      'Obteniendo colonias' :
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
          {!!Object.entries(this.state.errors).length && <div className="row">
            <div className="alert alert-danger" role="alert">
              <ul>
                {
                  Object.entries(this.state.errors).map(([key, error], i) =>
                    (<li key={i}>
                      {key}: {error}
                    </li>))
                }
              </ul>
            </div>
          </div>}
        </form>
        <ul>
          <li>id: { this.state.address.id }</li>
          <li>street: { this.state.address.street }</li>
          <li>ext_num: { this.state.address.ext_num }</li>
          <li>int_num: { this.state.address.int_num }</li>
          <li>zipcode: { this.state.address.zipcode }</li>
          <li>neighborhood: { this.state.address.neighborhood }</li>
          <li>city: { this.state.address.city }</li>
          <li>state: { this.state.address.state }</li>
          <li>country: { this.state.address.country }</li>
          <li>errors: { JSON.stringify(this.state.errors) }</li>
        </ul>
      </React.Fragment>
    )
  }
}

AddressForm.prototypes = {
  address: PropTypes.object,
  countries: PropTypes.array
}

export default AddressForm
