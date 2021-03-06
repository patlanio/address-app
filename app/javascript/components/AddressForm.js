import React, { useState, useEffect } from "react"
import { useParams, Navigate } from "react-router-dom"
import useDebounce from './use-debounce'

function AddressForm(props) {
  const params = useParams()
  const [neighborhoods, setNeighborhoods] = useState([])
  const [countries, setCountries] = useState([])
  const [errors, setErrors] = useState({})
  const [fetchingZipCodeRelatedData, setFetchingZipCodeRelatedData] = useState(false)
  const [redirectToHome, setRedirectToHome] = useState(false)
  const [redirectToShow, setRedirectToShow] = useState(0)

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
      let data = await response.json()
      data = {
        id: data.data.id,
        ...data.data.attributes
      }

      if (response.status < 200 || response.status >= 300) return Promise.reject(data)


      setRedirectToShow(data.id)
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

        if (response.status < 200 || response.status >= 300) return Promise.reject(data)

        setAddress({
          ...address,
          ...data
        })
        setErrors({})
        setRedirectToHome(true)
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
        if (response.status < 200 || response.status >= 300) return Promise.reject()
        setRedirectToHome(true)
      })
      .catch((errors) => {
        // setErrors(errors)
      })
  }

  const fetchAddress = () => {
    const id = address.id
    if (!id) return

    fetch(`/v1/addresses/${id}`, {method: 'GET'})
      .then(async response => {
        let data = await response.json()
        data = {
          id: data.data.id,
          ...data.data.attributes
        }

        if ((response.status < 200 || response.status >= 300) || !data.id)
          return Promise.reject(data)

        setAddress({
          ...address,
          ...data
        })
      })
      .catch(errors => {
        console.error('Cant get address', id, ': ', errors)
        setRedirectToHome(true)
      })
  }

  const fetchCountries = () => {
    fetch(`/v1/countries/`)
      .then(response => response.json())
      .then(data => {
        const countries = data.data.map((c) => { return {id: c.id, ...c.attributes} }) || []

        setCountries(countries)
        setAddress({
          ...address,
          country: countries[0].code
        })
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
    if (zipcode.length > 0 && isCountryPresent()) setFetchingZipCodeRelatedData(true)

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

  const handleCountryChange = (e) => {
    setAddress({
      ...address,
      country: e.target.value
    })
  }

  const handleDelete = (e) => {
    e.preventDefault()
    setErrors({})
    deleteAddress()
  }

  const isCountryPresent = () => {
    return address.country || countries.length > 0
  }

  const effectToFetchNeighborhoods = (manualCountry, manualZipcode) => {
    const countryToFetch = manualCountry || address.country
    if (!countryToFetch && !isCountryPresent()) return

    const zipCodeToFetch = manualZipcode || debouncedZipcode

    if (zipCodeToFetch) {
      setFetchingZipCodeRelatedData(true)
      fetchNeighborhoods(countryToFetch, zipCodeToFetch).then(data => {
        const fetchedNeighborhoods = data.neighborhoods || []
        setNeighborhoods(fetchedNeighborhoods)
        const currentNeighborhood = fetchedNeighborhoods.find(n => n === address.neighborhood)
        setAddress({
          ...address,
          neighborhood: currentNeighborhood || fetchedNeighborhoods[0] || '',
          state: data.state || '',
          city: data.city || ''
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
  }

  useEffect(()=>{
    fetchCountries()
    if (params.addressId || address.id) fetchAddress()
  }, [])

  useEffect(()=>{
    if (!isCountryPresent()) return // not set country if still fetching

    const firstCountry = countries[0].code
    setAddress({
      ...address,
      country: firstCountry
    })

    if (isCountryPresent() && address.zipcode && neighborhoods.length === 0) {
      effectToFetchNeighborhoods(firstCountry, address.zipcode)
    }
  }, [countries])

  useEffect(()=>{
    effectToFetchNeighborhoods()
  }, [debouncedZipcode])

  const availableNeighborhoods = neighborhoods.length > 0
  return (
    <React.Fragment>
      { redirectToHome && <Navigate to="/" /> }
      { !!redirectToShow && <Navigate to={`/address/${redirectToShow}`} /> }
      <form
        onSubmit={(e) => handleSumbit(e) }
        className="container card p-4 my-4"
        style={{maxWidth: 300}}
        >
        <div className="row justify-content-between align-items-start">
          <div className="col-8">
            <h2>Direcci??n</h2>
          </div>
          <div className="col-4">
            <select
              required
              onChange={(e) => handleCountryChange(e) }
              alt={errors.country || 'Pa??s'}
              value={address.country}
              className={`form-select mb-3 ${errors.country && 'is-invalid'}`}>
              {
                countries.length ? countries.map((country, i) =>
                (<option value={country.code} alt={country.name} key={country.id} style={{backgroundImage: `url(${country.flagUrl})`}}>
                  {country.code}
                </option>)) :
                (<option>Cargando pa??ses</option>)
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
              <input type="text" required placeholder="N??mero exterior" aria-label="N??mero exterior"
                className={`form-control ${errors.num_ext && 'is-invalid'}`}
                alt={errors.num_ext || 'N??mero exterior'}
                value={ address.ext_num }
                onChange={(e) => handleExtNumChange(e.target.value) } />
              <input type="text" required placeholder="N??mero interior" aria-label="N??mero interior"
                className={`form-control ${errors.num_int && 'is-invalid'}`}
                alt={errors.num_int || 'N??mero interior'}
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
                aria-label="C??digo postal"
                alt={errors.zipcode || 'C??digo postal'}
                onChange={(e) => handleZipCodeChange(e.target.value) }
                value={ address.zipcode } />
              <select
                required
                className={`form-control ${errors.neighborhood && 'is-invalid'}`}
                alt={errors.neighborhood || 'Neighborhood'}
                value={address.neighborhood}
                disabled={!availableNeighborhoods}
                onChange={(e) => handleNeighborhoodChange(e.target.value) } >
                {
                  availableNeighborhoods ? neighborhoods.map(neighborhood =>
                    (<option value={neighborhood} key={neighborhood}>
                      {neighborhood}
                    </option>))
                  : fetchingZipCodeRelatedData ?
                    (<option>Loading...</option>)
                  : (<option>Neighborhood</option>)
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
            <figure className="text-end">
              <figcaption className="blockquote-footer">
                <cite title={`${address.city}, ${address.state}`}>
                  {
                    fetchingZipCodeRelatedData ?
                    'Loading...' :
                    address.zipcode && address.neighborhood ?
                    `${address.city}, ${address.state}` :
                    'Introduce un c??digo postal v??lido'
                  }
                </cite>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="row justify-content-around">
          <div className="col">
            { address.id && <button onClick={(e) => handleDelete(e)} type="button" className="btn btn-light link-danger">Borrar</button> }
          </div>
          <div className="col">
            <button
              type="submit"
              className="btn btn-primary float-end"
              disabled={fetchingZipCodeRelatedData}
            >
              { fetchingZipCodeRelatedData && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> }
              { ` Save` }
            </button>
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
