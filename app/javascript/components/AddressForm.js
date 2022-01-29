import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useDebounce from './use-debounce'

function AddressForm(props) {
  const params = useParams()
  const [neighborhoods, setNeighborhoods] = useState([])
  const [countries, setCountries] = useState([])
  const [errors, setErrors] = useState({})
  const [fetchingZipCodeRelatedData, setFetchingZipCodeRelatedData] = useState(false)
  const [address, setAddress] = useState({
    id: params.addressId,
    street: '',
    ext_num: '',
    int_num: '',
    zipcode: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
  })

  const debouncedZipcode = useDebounce(address.zipcode, 500)

  const REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
  }

  const postAddress = () => {
    const requestOptions = {
      method: 'POST',
      headers: REQUEST_HEADERS,
      body: JSON.stringify(address)
    }

    fetch('/v1/addresses', requestOptions)
    .then(async response => {
      const data = await response.json()
      if (response.status < 200 && response.status >= 300) return Promise.reject(data)

      setAddress({
        ...address,
        ...data
      })
      setErrors({})
      console.log("Guardardo correcto", data)
    })
    .catch(errors => {
      setErrors(errors)
    })
  }

  const updateAddress = () => {
    const requestOptions = {
      method: 'PUT',
      headers: REQUEST_HEADERS,
      body: JSON.stringify(address)
    }

    fetch(`/v1/addresses/${address.id}`, requestOptions)
      .then(async response => {
        const data = await response.json()

        if (response.status < 200 && response.status >= 300) return Promise.reject(data)

        setAddress({
          ...address,
          ...data
        })
        setErrors({})
      })
      .catch(errors => {
        setErrors(errors)
      })
  }

  const deleteAddress = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: REQUEST_HEADERS,
      body: JSON.stringify(address)
    }

    fetch(`/v1/addresses/${address.id}`, requestOptions)
      .then(async response => {
        if (response.status < 200 && response.status >= 300) return Promise.reject()
      })
      .catch(() => {
        // setErrors(errors)
      })
  }

  const fetchAddress = () => {
    const id = address.id
    if (!id) return

    fetch(`/v1/addresses/${id}`, {method: 'GET'})
      .then(async response => {
        const data = await response.json()

        if (response.status < 200 && response.status >= 300 || !data.id)
          return Promise.reject(data)

        setAddress({
          ...address,
          ...data
        })
      })
      .catch(errors => {
        console.error('Cant get address', id, ': ', errors)
      })
  }

  const fetchCountries = () => {
    fetch(`/v1/countries/`)
      .then(response => response.json())
      .then(data => {
        const countries = data || []
        setCountries(countries)
      })
  }

  const fetchNeighborhoods = async (country, zipcode) => {
    return fetch(`/v1/addresses/neighborhoods?country=${country}&zipcode=${zipcode}`)
      .then(response => response.json())
      .catch(error => {
        return []
      })
  }

  const handleNeighborhoodChange = (neighborhood) => {
    setFetchingZipCodeRelatedData(false)
    setAddress({
      ...address,
      neighborhood: neighborhood,
    })
  }

  const handleZipCodeChange = (zipcode) => {
    if (zipcode.length > 0) setFetchingZipCodeRelatedData(true)

    setNeighborhoods([])
    setAddress({
      ...address,
      zipcode: zipcode,
      neighborhood: '',
      state: ''
    })
  }

  const handleStreetChange = (street) => {
    setAddress({
      ...address,
      street: street
    })
  }

  const handleExtNumChange = (ext_num) => {
    setAddress({
      ...address,
      ext_num: ext_num
    })
  }

  const handleIntNumChange = (int_num) => {
    setAddress({
      ...address,
      int_num: int_num
    })
  }

  const handleSumbit = (e) => {
    e.preventDefault()
    setErrors({})
    const action = (params.addressId || address.id) ? updateAddress : postAddress
    action()
  }

  const handleSumbit = (e) => {
    e.preventDefault()
    setErrors({})
    postAddress()
  }

  useEffect(()=>{
    fetchCountries()
    if (params.addressId || address.id) fetchAddress()
  }, [])

  useEffect(()=>{
    if (countries.length === 0) return

    setAddress({
      ...address,
      country: countries[0].name
    })
  }, [countries])

  useEffect(
    () => {
      if (debouncedZipcode) {
        setFetchingZipCodeRelatedData(true)
        fetchNeighborhoods(address.country, debouncedZipcode).then(data => {
          const fetchedNeighborhoods = data.neighborhoods || []
          setNeighborhoods(fetchedNeighborhoods)
          setAddress({
            ...address,
            neighborhood: fetchedNeighborhoods[0],
            state: data.state,
            city: data.city
          })
          setFetchingZipCodeRelatedData(false)
        })
      } else {
        setFetchingZipCodeRelatedData(false)
        setNeighborhoods([])
        setAddress({
          ...address,
          neighborhood: '',
          state: '',
          city: ''
        })
      }
    },
    [debouncedZipcode]
  )

  const availableNeighborhoods = neighborhoods.length > 0
  return (
    <React.Fragment>
      <form
        onSubmit={(e) => handleSumbit(e) }
        className="container"
        style={{maxWidth: 300}}
        >
        <div className="row justify-content-between align-items-start">
          <div className="col-8">
            <h2>Dirección</h2>
          </div>
          <div className="col-4">
            <select
              required
              alt={errors.country || 'País'}
              className={`form-select mb-3 ${errors.country && 'is-invalid'}`}>
              {
                countries.length ? countries.map((country, i) =>
                (<option value={country.id} key={country.id} style={{backgroundImage: `url(${country.flagUrl})`}}>
                  {country.name}
                </option>)) :
                (<option>Cargando países</option>)
              }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="input-group mb-3">
              <input type="text" required placeholder="Calle" aria-label="Calle"
                className={`form-control ${errors.street && 'is-invalid'}`}
                alt={errors.street || 'Calle'}
                value={ address.street }
                onChange={(e) => handleStreetChange(e.target.value) } />
              <input type="text" required placeholder="Número exterior" aria-label="Número exterior"
                className={`form-control ${errors.num_ext && 'is-invalid'}`}
                alt={errors.num_ext || 'Número exterior'}
                value={ address.ext_num }
                onChange={(e) => handleExtNumChange(e.target.value) } />
              <input type="text" required placeholder="Número interior" aria-label="Número interior"
                className={`form-control ${errors.num_int && 'is-invalid'}`}
                alt={errors.num_int || 'Número interior'}
                value={ address.int_num }
                onChange={(e) => handleIntNumChange(e.target.value) } />
              { (errors.street || errors.ext_num) &&
                <div className="invalid-tooltip">{[errors.street, errors.ext_num].join(', ')}</div>
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
                className={`form-control ${errors.zipcode && 'is-invalid'}`}
                placeholder="64000"
                aria-label="Código postal"
                alt={errors.zipcode || 'Código postal'}
                onChange={(e) => handleZipCodeChange(e.target.value) }
                value={ address.zipcode } />
              <select
                required
                className={`form-control ${errors.neighborhood && 'is-invalid'}`}
                alt={errors.neighborhood || 'Colonia'}
                disabled={!availableNeighborhoods}
                onChange={(e) => handleNeighborhoodChange(e.target.value) } >
                {
                  availableNeighborhoods ? neighborhoods.map(neighborhood =>
                    (<option value={neighborhood} key={neighborhood}>
                      {neighborhood}
                    </option>))
                  : fetchingZipCodeRelatedData ?
                    (<option>Cargando...</option>)
                  : (<option>Colonia</option>)
                }
              </select>
              { (errors.zipcode || errors.neighborhood) &&
                <div className="invalid-tooltip">{[errors.zipcode, errors.neighborhood].join(', ')}</div>
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {
              fetchingZipCodeRelatedData ?
              <div className="spinner-grow spinner-grow-sm float-end" role="status">
                <span className="visually-hidden">Obteniendo colonias</span>
              </div> :
              <figure className="text-end">
                <figcaption className="blockquote-footer">
                  <cite title={`${address.city}, ${address.state}`}>
                    {
                      address.zipcode && address.neighborhood ?
                      `${address.city}, ${address.state}` :
                      'Introduce un código postal válido'
                    }
                  </cite>
                </figcaption>
              </figure>
            }
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </div>
        {!!Object.entries(errors).length && <div className="row">
          <div className="alert alert-danger" role="alert">
            <ul>
              {
                Object.entries(errors).map(([key, error], i) =>
                  (<li key={i}>
                    {key}: {error}
                  </li>))
              }
            </ul>
          </div>
        </div>}
      </form>
      <ul>
        <li>id: { address.id }</li>
        <li>street: { address.street }</li>
        <li>ext_num: { address.ext_num }</li>
        <li>int_num: { address.int_num }</li>
        <li>zipcode: { address.zipcode }</li>
        <li>neighborhood: { address.neighborhood }</li>
        <li>city: { address.city }</li>
        <li>state: { address.state }</li>
        <li>country: { address.country }</li>
        <li>errors: { JSON.stringify(errors) }</li>
      </ul>
    </React.Fragment>
  )
}

export default AddressForm
