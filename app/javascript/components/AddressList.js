import React, { useState, useEffect } from "react"
import AddressCard from './address/AddressCard'

function AddressList(props) {
  const [addresses, setAddresses] = useState([])
  const [fetchingAddresses, setFetchingAddresses] = useState(false)

  const fetchAddresses = () => {
    setFetchingAddresses(true)
    fetch(`/v1/addresses/`)
      .then(response => response.json())
      .then(data => {
        const addresses = data.data.map((a) => { return {id: parseInt(a.id), ...a.attributes} }) || []
        setAddresses(addresses)
        setFetchingAddresses(false)
      })
      .catch(errors => {
        setFetchingAddresses(false)
      })
  }

  useEffect(()=>{
    fetchAddresses()
  }, [])

  const availableAddresses = addresses.length > 0
  return (
    <div className="container p-4">
      <div className={`row ${fetchingAddresses ? 'justify-content-center' : 'row-cols-1 row-cols-md-2 row-cols-lg-3' }`}>
        {
          availableAddresses ? addresses.map(address =>
            (<div className="col mb-4">
              <AddressCard key={address.id} {...address} />
            </div>))
          : fetchingAddresses ?
            (<div className="col-auto">
              <div className="spinner-border" role="status" style={{width: '4rem', height: '4rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>)
          :
            (<div className="col"><h1>No addresses yet</h1></div>)
        }
      </div>
    </div>
  )
}

export default AddressList
