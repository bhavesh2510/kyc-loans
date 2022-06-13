import React, { Component, useEffect, useState } from 'react'
import Service from '../services/service'
import localforage from 'localforage'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router'
import RestrictUser from './RestrictUser'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
toast.configure()

const BusinessProperty = () => {
  // create a ref to store the DOM element

  const x = JSON.parse(localStorage.getItem('previous_data'))

  const history = useHistory()

  const [state, setState] = useState({
    property_information: '',
    monthly_rent: '',
    lease_end_date: '',
    landlord_name: ''
  })

  // handleSubmit = this.handleSubmit.bind(this);
  // this.handleInputChanged = this.handleInputChanged.bind(this);

  const handleSubmit = (e) => {
    e.preventDefault()
    var validForm = true

    if (!state.property_information || state.property_information == '.') {
      setState({
        ...state,
        property_informationError: 'This field is required.'
      })
      validForm = false
    }
    if (!state.monthly_rent || state.monthly_rent == '.') {
      setState({ ...state, monthly_rentError: 'This field is required.' })
      validForm = false
    }
    if (!startDate) {
      setState({ ...state, lease_end_dateError: 'This field is required.' })
      validForm = false
    }
    if (!state.landlord_name || state.landlord_name == '.') {
      setState({ ...state, landlord_nameError: 'This field is required.' })
      validForm = false
    }
    if (validForm) {
      var axios = require('axios')
      var formated_date = moment(startDate).format('MM/DD/YYYY')
      var data = {
        id: `${x.id}`,
        property_information: `${state.property_information}`,
        monthly_rent: `${state.monthly_rent}`,
        lease_end_date: `${formated_date}`,
        landlord_name: `${state.landlord_name}`,
        status: 'incomplete'
      }
      console.log('data is', data, formated_date)

      var config = {
        method: 'put',
        url: 'https://hrm.zotto.io/api/business-property-information-update',
        mode: 'no-cors',
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: data
      }

      axios(config)
        .then(function (response) {
          console.log('response of update', response)
          toast.success('Records added successfully', {
            position: 'top-right',
            autoClose: 1000
          })

          history.push('/processing_information')
        })
        .catch(function (error) {
          setState({ ...state, error: error })
          toast.error('Something went wrong !!', {
            position: 'top-right',
            autoClose: 5000
          })
        })
    }
    var axios = require('axios')
    const email = JSON.parse(localStorage.getItem('add_user'))
    const companyId = JSON.parse(localStorage.getItem('company_id'))
    var data = {
      company_email: `${email.companyemail}`,
      company_id: `${companyId}`
    }

    var config = {
      method: 'post',
      mode: 'no-cors',
      url: 'https://hrm.zotto.io/api/loans-get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios(config)
      .then(function (response) {
        console.log('response of get', response.data)

        localStorage.setItem(
          'previous_data',
          JSON.stringify(response.data.Loans)
        )
      })
      .catch(function (error) {
        console.log('error of get', error)
      })
  }

  const handleInputChanged = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
      property_informationError: '',
      monthly_rentError: '',
      lease_end_dateError: '',
      landlord_nameError: ''
    })
  }

  const [restrict, setrestrict] = useState()
  useEffect(() => {
    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    console.log('y is', y)
    console.log('y is', restrict)
    y == 0 ? setrestrict(true) : setrestrict(false)
    // if (y == 0) {
    //   setrestrict(true);
    // } else if (y == 1) {
    //   setrestrict(false);
    // }
    console.log('x is', x)
    if (x) {
      setState({
        ...state,
        property_information: x.property_information,
        monthly_rent: x.monthly_rent,
        lease_end_date: x.lease_end_date,
        landlord_name: x.landlord_name
      })
      if (x.lease_end_date !== '.') {
        setStartDate(new Date(x.lease_end_date))
      }
    } else {
      setState({
        ...state,
        property_information: '',
        monthly_rent: '',
        lease_end_date: '',
        landlord_name: ''
      })
      setStartDate()
    }
  }, [])

  useEffect(() => {
    console.log('state is', state)
  }, [state])
  const [startDate, setStartDate] = useState()
  useEffect(() => {
    // alert('hey')
    // setState({ ...state, lease_end_date: startDate })
  }, [startDate])

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
                  <span>Step 4 of 7</span>
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
                          id='property_information'
                          name='property_information'
                          autoComplete='off'
                          value={
                            state.property_information == '.'
                              ? ''
                              : state.property_information
                          }
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
                          id='monthly_rent'
                          name='monthly_rent'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.monthly_rent == '.' ? '' : state.monthly_rent
                          }
                          placeholder='Bank Name'
                        />
                        <span className='bar'></span>
                        <label htmlFor='monthly_rent'>
                          Monthly Rent / Mortgage Payment
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.monthly_rentError}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <DatePicker
                          className='form-control-for-date'
                          dateFormat='dd/MM/yyyy'
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText='Lease End Date (DD/MM/YYYY)'
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode='select'
                        />
                        <div className='form-text'>
                          {state.lease_end_dateError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='landlord_name'
                          name='landlord_name'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.landlord_name == '.'
                              ? ''
                              : state.landlord_name
                          }
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
