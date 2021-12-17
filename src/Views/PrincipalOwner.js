import React, { Component, useEffect, useState } from 'react'
import Service from '../services/service'
import localforage from 'localforage'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router-dom'
import RestrictUser from './RestrictUser'
import { CountryDropdown } from 'react-country-region-selector'
toast.configure()

const PrincipalOwner = () => {
  // create a ref to store the DOM element
  const history = useHistory()
  const x = JSON.parse(localStorage.getItem('previous_data'))

  const [state, setState] = useState({
    full_name_1: '',
    dob_1: '',
    length_ownership_1: '',
    phone_1: '',
    email_1: '',
    address_line_1: '',
    address_line_2: '',
    city_1: '',
    state_of_add_1: '',
    zipcode_1: '',
    coutry_1: '',
    imhome_1: '',

    full_name_2: '',
    dob_2: '',
    length_ownership_2: '',
    phone_2: '',
    email_2: '',
    address_line_2_1: '',
    address_line_2_2: '',
    city_2: '',
    state_2: '',
    zipcode_2: '',
    coutry_2: '',
    imhome_2: ''
  })

  // handleSubmit = this.handleSubmit.bind(this);
  // this.handleInputChanged = this.handleInputChanged.bind(this);

  useEffect(() => {
    console.log('state in ba', state)
  }, [state])

  const handleSubmit = (e) => {
    const y = JSON.parse(localStorage.getItem('kyc_id'))
    e.preventDefault()
    var validForm = true
    history.push('/business_property')
    return
    if (!state.full_name_1) {
      setState({ ...state, full_name_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.dob_1) {
      setState({ ...state, dob_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.length_ownership_1) {
      setState({
        ...state,
        length_ownership_1_Error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.phone_1) {
      setState({ ...state, phone_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.email_1) {
      setState({ ...state, email_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.address_line_1) {
      setState({ ...state, address_line_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.address_line_2) {
      setState({ ...state, address_line_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.city_1) {
      setState({ ...state, city_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.state_of_add_1) {
      setState({ ...state, state_of_add_1_Error: 'This field is required.' })
      validForm = false
    }

    if (!state.zipcode_1) {
      setState({ ...state, zipcode_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.country_1) {
      setState({ ...state, country_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.imhome_1) {
      setState({ ...state, imhome_1_Error: 'This field is required.' })
      validForm = false
    }

    if (!state.full_name_2) {
      setState({ ...state, full_name_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.dob_2) {
      setState({ ...state, dob_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.length_ownership_2) {
      setState({
        ...state,
        length_ownership_2_Error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.phone_2) {
      setState({ ...state, phone_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.email_2) {
      setState({ ...state, email_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.address_line_2_1) {
      setState({ ...state, address_line_2_1_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.address_line_2_2) {
      setState({ ...state, address_line_2_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.city_2) {
      setState({ ...state, city_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.state_of_add_2) {
      setState({ ...state, state_of_add_2_Error: 'This field is required.' })
      validForm = false
    }

    if (!state.zipcode_2) {
      setState({ ...state, zipcode_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.country_2) {
      setState({ ...state, country_2_Error: 'This field is required.' })
      validForm = false
    }
    if (!state.imhome_2) {
      setState({ ...state, imhome_2_Error: 'This field is required.' })
      validForm = false
    }

    if (validForm) {
      history.push('/business_property')
    }
  }

  const [dropdown, setdropdown] = useState()

  const handleTypeOfBusiness = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,

      typeError: '',
      offered_servicesError: '',
      annual_turnoverError: '',
      card_salesError: '',
      avg_transactionError: '',
      max_amt_per_transError: '',
      new_card_processError: ''
    })
  }

  const selectCountry = (val) => {
    console.log('country val', val)
    setState({ ...state, country_1: val, country_1_Error: '' })
    // countryCode = val
  }

  const selectCountry_2 = (val) => {
    console.log('country val', val)
    setState({ ...state, country_2: val, country_2_Error: '' })
    // countryCode = val
  }
  const handleInputChanged = (event) => {
    console.log('name is', event.target.value)
    //setdropdown(event.target.value);
    var x = event.target.value
    setState({
      ...state,
      [event.target.name]: event.target.value,

      full_name_1_Error: '',
      dob_1_Error: '',
      length_ownership_1_Error: '',
      phone_1_Error: '',
      email_1_Error: '',
      address_line_1_Error: '',
      address_line_2_Error: '',
      city_1_Error: '',
      state_of_add_1_Error: '',
      zipcode_1_Error: '',
      coutry_1_Error: '',
      imhome_1_Error: '',

      full_name_2_Error: '',
      dob_2_Error: '',
      length_ownership_2_Error: '',
      phone_2_Error: '',
      email_2_Error: '',
      address_line_2_1_Error: '',
      address_line_2_2_Error: '',
      city_2_Error: '',
      state_of_add_2_Error: '',
      zipcode_2_Error: '',
      coutry_2_Error: '',
      imhome_2_Error: ''
    })
  }

  useEffect(() => {
    console.log('business state', dropdown)
  }, [dropdown])

  const setValues = (e) => {
    // let self = this;
    localforage
      .getItem('bus_act_data')
      .then(function (value) {
        console.log('value is', value)
        setState({
          ...state,
          type: value.type,
          offered_services: value.offered_services,
          annual_turnover: value.annual_turnover,
          card_sales: value.card_sales,
          avg_transaction: value.avg_transaction,
          max_amt_per_trans: value.max_amt_per_trans,
          number_of_chargeback: value.number_of_chargeback,
          new_card_process: value.new_card_process,
          previous_acquirer: value.previous_acquirer
        })
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  const [restrict, setrestrict] = useState()
  useEffect(() => {
    setValues()
    // const x = JSON.parse(localStorage.getItem('business_activities'));
    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    console.log('y is', y)
    console.log('y is', restrict)

    if (y == 0) {
      setrestrict(true)
    } else if (y == 1) {
      setrestrict(false)
    }
    console.log('x is', x)
    if (x) {
      setState({
        ...state,
        type: x.type,
        offered_services: x.offered_services,
        annual_turnover: x.annual_turnover,
        card_sales: x.card_sales,
        avg_transaction: x.avg_transaction,
        max_amt_per_trans: x.max_amt_per_trans,
        number_of_chargeback: x.number_of_chargeback,
        new_card_process: x.new_card_process
      })
    }
  }, [])

  useEffect(() => {
    console.log('state of ba', state)
    localStorage.setItem('business_activities', JSON.stringify(state))
  }, [state])

  return (
    <>
      {restrict ? (
        <RestrictUser />
      ) : (
        <div className='content-box'>
          <div className='container-fluid h-100'>
            <div className='row justify-content-center align-items-center h-100'>
              <div className='col-sm-12 py-4'>
                <div className='text-center steping'>
                  <span>Step 3 of 6</span>
                </div>
                <div
                  onClick={() => history.push('/business_details')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>
                <form onSubmit={handleSubmit} style={{ marginTop: '5%' }}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Owner / Principal Details (minimum 51% ownership)
                  </h4>
                  <div className='row justify-content-center g-3'>
                    <h5 style={{ textAlign: 'center' }}>Applicant 1</h5>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          placeholder='Leave a comment here'
                          autoComplete='off'
                          name='full_name_1'
                          id='full_name_1'
                          value={state.full_name_1}
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='full_name_1'>
                          Full Name
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.full_name_1_Error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          name='dob_1'
                          autoComplete='off'
                          id='dob_1'
                          onChange={handleInputChanged}
                          value={state.dob_1}
                          placeholder='Annual Turnover'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='dob_1'>
                          Date Of Birth (DD/MM/YYYY)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.dob_1_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='length_ownership_1'
                          name='length_ownership_1'
                          autoComplete='off'
                          value={state.length_ownership_1}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='length_ownership_1'>
                          Length of Business Ownership
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.length_ownership_1_Error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='email_1'
                          name='email_1'
                          autoComplete='off'
                          value={state.email_1}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='email_1'>
                          Email
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.email_1_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='phone_1'
                          name='phone_1'
                          autoComplete='off'
                          value={state.phone_1}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='phone_1'>
                          Phone
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.phone_1_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='address_line_1'
                          name='address_line_1'
                          autoComplete='off'
                          value={state.address_line_1}
                          placeholder='Address Line 1'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='address_line_1'>
                          Address Line 1
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.address_line_1_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='address_line_2'
                          name='address_line_2'
                          autoComplete='off'
                          value={state.address_line_2}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='address_line_2'>
                          Address Line 2
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.address_line_2_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='city_1'
                          name='city_1'
                          autoComplete='off'
                          value={state.city_1}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='city_1'>City</label>
                        <div className='form-text'>{state.city_1_Error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='state_of_add_1'
                          name='state_of_add_1'
                          autoComplete='off'
                          value={state.state_of_add_1}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='state_of_add_1'>State</label>
                        <div className='form-text'>
                          {state.state_of_add_1_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='zipcode_1'
                          name='zipcode_1'
                          autoComplete='off'
                          value={state.zipcode_1}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='zipcode_1'>
                          Postal/Zipcode
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.zipcode_1_Error}</div>
                      </div>
                    </div>

                    <div
                      className='col-md-6 col-xl-5'
                      style={{ marginLeft: '0px' }}
                    >
                      <div className='form-floating'>
                        <CountryDropdown
                          className='form-select form-control'
                          value={state.country_1}
                          valueType='short'
                          onChange={(val) => selectCountry(val)}
                        />
                        <div className='form-text'>{state.country_1_Error}</div>
                        <span className='bar'></span>
                        <label htmlFor='countryofincorporation'>
                          Country <strong className='text-danger'>*</strong>
                        </label>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <select
                          defaultValue={'DEFAULT'}
                          className='form-select form-control'
                          name='imhome_1'
                          autoComplete='off'
                          value={state.imhome_1}
                          id='type'
                          onChange={handleInputChanged}
                          // onChange={handleTypeOfBusiness}
                          aria-label='Floating label select example'
                        >
                          <option value=''>Select Type</option>
                          <option value='pub'>Owner</option>
                          <option value='restaurant' name='restaurant'>
                            Renter
                          </option>
                        </select>
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='type'>
                          I am a home
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.imhome_1_Error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5 mt-0'></div>

                    <h5 style={{ textAlign: 'center' }}>Applicant 2</h5>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          placeholder='Leave a comment here'
                          autoComplete='off'
                          name='full_name_2'
                          id='full_name_2'
                          value={state.full_name_2}
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='full_name_2'>
                          Full Name
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.full_name_2_Error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          name='dob_2'
                          autoComplete='off'
                          id='dob_2'
                          onChange={handleInputChanged}
                          value={state.dob_2}
                          placeholder='Annual Turnover'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='dob_2'>
                          Date Of Birth (DD/MM/YYYY)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.dob_2_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='length_ownership_2'
                          name='length_ownership_2'
                          autoComplete='off'
                          value={state.length_ownership_2}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='length_ownership_2'>
                          Length of Business Ownership
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.length_ownership_2_Error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='email_2'
                          name='email_2'
                          autoComplete='off'
                          value={state.email_2}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='email_2'>
                          Email
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.email_2_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='phone_2'
                          name='phone_2'
                          autoComplete='off'
                          value={state.phone_2}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='phone_2'>
                          Phone
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.phone_2_Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='address_line_2_1'
                          name='address_line_2_1'
                          autoComplete='off'
                          value={state.address_line_2_1}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='address_line_2_1'>
                          Address Line 1
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.address_line_2_1_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='address_line_2_2'
                          name='address_line_2_2'
                          autoComplete='off'
                          value={state.address_line_2_2}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='address_line_2_2'>
                          Address Line 2
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.address_line_2_2_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='city_2'
                          name='city_2'
                          autoComplete='off'
                          value={state.city_2}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='city_2'>City</label>
                        <div className='form-text'>{state.city_2_Error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='state_of_add_2'
                          name='state_of_add_2'
                          autoComplete='off'
                          value={state.state_of_add_2}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='state_of_add_2'>State</label>
                        <div className='form-text'>
                          {state.state_of_add_2_Error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          id='zipcode_2'
                          name='zipcode_2'
                          autoComplete='off'
                          value={state.zipcode_2}
                          placeholder='Address Line 2'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='zipcode_2'>
                          Postal/Zipcode
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.zipcode_2_Error}</div>
                      </div>
                    </div>

                    <div
                      className='col-md-6 col-xl-5'
                      style={{ marginLeft: '0px' }}
                    >
                      <div className='form-floating'>
                        <CountryDropdown
                          className='form-select form-control'
                          value={state.country_2}
                          valueType='short'
                          onChange={(val) => selectCountry_2(val)}
                        />
                        <div className='form-text'>{state.country_2_Error}</div>
                        <span className='bar'></span>
                        <label htmlFor='countryofincorporation'>
                          Country <strong className='text-danger'>*</strong>
                        </label>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <select
                          defaultValue={'DEFAULT'}
                          className='form-select form-control'
                          name='imhome_2'
                          autoComplete='off'
                          value={state.imhome_2}
                          id='type'
                          onChange={handleInputChanged}
                          // onChange={handleTypeOfBusiness}
                          aria-label='Floating label select example'
                        >
                          <option value=''>Select Type</option>
                          <option value='pub'>Owner</option>
                          <option value='restaurant' name='restaurant'>
                            Renter
                          </option>
                        </select>
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='type'>
                          I am a home
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.imhome_2_Error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5 mt-0'></div>
                    <div className='w-100'></div>
                    <div className='col-md-12 col-xl-5 mt-0'>
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
export default PrincipalOwner
