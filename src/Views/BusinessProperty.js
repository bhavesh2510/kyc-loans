import React, { Component, useEffect, useState } from 'react'
import Service from '../services/service'
import localforage from 'localforage'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router'
import RestrictUser from './RestrictUser'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
toast.configure()

const BusinessProperty = () => {
  // create a ref to store the DOM element

  const x = JSON.parse(localStorage.getItem('previous_data'))

  const history = useHistory()

  const [state, setState] = useState({
    property_information: '',
    monthly_payment: '',
    lease_end_date: '',
    landlord_name: ''
  })

  // handleSubmit = this.handleSubmit.bind(this);
  // this.handleInputChanged = this.handleInputChanged.bind(this);

  const handleSubmit = (e) => {
    e.preventDefault()
    var validForm = true
    history.push('/processing_information')
    return
    if (!state.property_information) {
      setState({
        ...state,
        property_informationError: 'This field is required.'
      })
      validForm = false
    }
    if (!state.monthly_payment) {
      setState({ ...state, monthly_paymentError: 'This field is required.' })
      validForm = false
    }
    if (!state.lease_end_date) {
      setState({ ...state, lease_end_dateError: 'This field is required.' })
      validForm = false
    }
    if (!state.landlord_name) {
      setState({ ...state, landlord_nameError: 'This field is required.' })
      validForm = false
    }
    if (validForm) {
    }
  }

  const verifyIBAN = (event) => {
    var iban_no = event.target.value
    if (iban_no === '') {
      return false
    }
    Service.validateIBAN(iban_no).then((responce) => {
      if (responce.status === 200) {
        var element = document.getElementById('iban_number')
        element.classList.remove('is-valid')
        element.classList.remove('is-invalid')
        if (responce.data.valid) {
          element.classList.add('is-valid')
        } else {
          element.classList.add('is-invalid')
        }
      }
    })
  }

  const handleInputChanged = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
      property_informationError: '',
      monthly_paymentError: '',
      lease_end_dateError: '',
      landlord_nameError: ''
    })
  }

  const [restrict, setrestrict] = useState()
  useEffect(() => {}, [])

  useEffect(() => {
    localStorage.setItem('bank_details', JSON.stringify(state))
  }, [state])

  const [startDate, setStartDate] = useState()

  return (
    <>
      {restrict ? (
        <RestrictUser />
      ) : (
        <div className='content-box'>
          <div className='container-fluid h-100'>
            <div
              className='row justify-content-center align-items-center'
              style={{ minHeight: '100%' }}
            >
              <div className='col-sm-12 py-4'>
                <div className='text-center steping'>
                  <span>Step 4 of 6</span>
                </div>
                <div
                  onClick={() => history.push('/principal_owner')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>
                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Business Property Information
                  </h4>
                  <div className='row justify-content-center g-3'>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='account_name'
                          name='account_name'
                          autoComplete='off'
                          value={state.property_information}
                          onChange={handleInputChanged}
                          placeholder='Account Name'
                        />
                        <span className='bar'></span>
                        <label htmlFor='property_information'>
                          Property Information
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.property_informationError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='monthly_payment'
                          name='monthly_payment'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.monthly_payment}
                          placeholder='Bank Name'
                        />
                        <span className='bar'></span>
                        <label htmlFor='monthly_payment'>
                          Monthly Rent / Mortgage Payment
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.monthly_paymentError}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <DatePicker
                          className='form-control-for-date'
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText='Lease End Date (MM/DD/YYYY)'
                        />
                        <div className='form-text'>
                          {state.lease_end_dateError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='landlord_name'
                          name='landlord_name'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.landlord_name}
                          placeholder='Account Number'
                        />
                        <span className='bar'></span>
                        <label htmlFor='landlord_name'>
                          Landlord Name / Mortgage Company Name
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.landlord_nameError}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-12 col-xl-5'>
                      <input
                        type='submit'
                        name='submit'
                        className='btn btn-primary w-100 btn-lg show-opt'
                        value='Next Step'
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default BusinessProperty
