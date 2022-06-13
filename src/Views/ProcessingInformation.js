import React, { Component, useEffect, useState } from 'react'
import Service from '../services/service'
import { CountryDropdown } from 'react-country-region-selector'
import localforage from 'localforage'
import { useHistory } from 'react-router'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { stat } from 'fs'
import RestrictUser from './RestrictUser'
import axios from 'axios'

toast.configure()

const ProcessingInformation = () => {
  const history = useHistory()
  let countryCode = ''
  let company = ''
  let country = ''

  const [error, setError] = useState({})
  //   const { country } = state;

  const x = JSON.parse(localStorage.getItem('previous_data'))

  const [state, setState] = useState({
    current_processing_company: '',
    monthly_card_sales: '',
    gross_monthly_sales: '',
    no_terminals: '',
    no_locations: '',
    desired_funding_amount: ''
  })

  useEffect(() => {
    console.log('state in bd', state)
  }, [state])

  // const {
  //   companynumber,
  //   dateofincorporation,
  //   address1,
  //   city,
  //   post_code,
  //   vatnumber,
  //   dbalegalname,
  //   dbaaddress,
  //   websitename,
  //   country,
  // } = state;

  //   const handleSubmit = handleSubmit.bind(this);
  //   const handleInputChanged = handleInputChanged.bind(this);
  //   const getCompanyData = getCompanyData.bind(this);
  //   const setValues = setValues.bind(this);

  const handleSubmit = (e) => {
    e.preventDefault()
    var validForm = true
    console.log('check', state.country)

    if (
      !state.current_processing_company ||
      state.current_processing_company == '.'
    ) {
      setError({
        ...error,
        current_processing_company_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.monthly_card_sales || state.monthly_card_sales == '.') {
      setError({
        ...error,
        monthly_card_sales_error: 'This field is required.'
      })
      validForm = false
    }

    if (!state.gross_monthly_sales || state.gross_monthly_sales == '.') {
      setError({
        ...error,
        gross_monthly_sales_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.no_terminals || state.no_terminals == '.') {
      setError({ ...error, no_terminals_error: 'This field is required.' })
      validForm = false
    }
    if (!state.no_locations || state.no_locations == '.') {
      setError({ ...error, no_locations_error: 'This field is required.' })
      validForm = false
    }
    if (!state.desired_funding_amount || state.desired_funding_amount == '.') {
      setError({
        ...error,
        desired_funding_amount_error: 'This field is required.'
      })
      validForm = false
    }

    if (validForm) {
      var axios = require('axios')

      var data = {
        id: `${x.id}`,

        current_processing_company: `${state.current_processing_company}`,
        monthly_card_sales: `${state.monthly_card_sales}`,
        gross_monthly_sales: `${state.gross_monthly_sales}`,
        no_terminals: `${state.no_terminals}`,
        no_locations: `${state.no_locations}`,
        desired_funding_amount: `${state.desired_funding_amount}`,
        status: 'incomplete'
      }

      var config = {
        method: 'put',
        url: 'https://hrm.zotto.io/api/processing-information-update',
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

          history.push('/merchant_question')
        })
        .catch(function (error) {
          setState({ ...state, error: error })
          toast.error('Something went wrong !!', {
            position: 'top-right',
            autoClose: 5000
          })
        })
    }

    //get
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
      [event.target.name]: event.target.value
    })
    setError({
      ...error,
      current_processing_company_error: '',
      monthly_card_sales_error: '',
      gross_monthly_sales_error: '',
      no_terminals_error: '',
      no_locations_error: '',
      desired_funding_amount_error: ''
    })
    // const prev_data = JSON.parse(localStorage.getItem('add_user'));
    // console.log('target name', event.target.name);
    // if (event.target.name == 'companynumber') {
    //   if (state.country == 'DK') {
    //     var axios = require('axios');
    //     var data = JSON.stringify({
    //       email: `${prev_data.companyemail}`,
    //     });

    //     var config = {
    //       method: 'get',
    //       url: `https://pay.cibopay.com/getData/cvrsearch/regnumber/${event.target.value}`,
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       data: data,
    //     };

    //     axios(config)
    //       .then(function (response) {
    //         console.log('response of new api', response);
    //         // if (!response.data.error) {
    //         //   setState({
    //         //     ...state,

    //         //     dateofincorporation: response.data.startdate
    //         //       ? response.data.startdate
    //         //       : '',
    //         //     address1: response.data.address ? response.data.address : '',
    //         //     city: response.data.city ? response.data.city : '',
    //         //     post_code: response.data.zipcode ? response.data.zipcode : '',
    //         //     vatnumber: response.data.vat ? response.data.vat : '',
    //         //     company_name: response.data.name ? response.data.name : '',
    //         //   });
    //         // }
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    //   } else if (state.country == 'GB') {
    //     var axios = require('axios');
    //     var data = JSON.stringify({
    //       email: `${prev_data.companyemail}`,
    //     });

    //     var config = {
    //       method: 'get',
    //       url: `https://pay.cibopay.com/getData/search/regnumber/${event.target.value}`,
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Cookie: 'ci_session=kihkhpchd8cv0ekcb39q5kll9f97begm',
    //       },
    //       data: data,
    //     };

    //     axios(config)
    //       .then(function (response) {
    //         console.log('reg number', response.data.DATA);

    //         if (!response.data.DATA.errors) {
    //           setState({
    //             ...state,
    //             companynumber: response.data.DATA.company_number,
    //             dateofincorporation: response.data.DATA.date_of_creation,
    //             address1:
    //               response.data.DATA.registered_office_address.address_line_1,

    //             post_code:
    //               response.data.DATA.registered_office_address.postal_code,
    //             vatnumber: x.vat_number,

    //             company_name: response.data.DATA.company_name,
    //           });
    //         }
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });
    //   }
    // }
  }

  const [restrict, setrestrict] = useState()
  useEffect(() => {
    // setValues();
    // const x = JSON.parse(localStorage.getItem('business_detail'));
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
        current_processing_company: x.current_processing_company,
        monthly_card_sales: x.monthly_card_sales,
        gross_monthly_sales: x.gross_monthly_sales,
        no_terminals: x.no_terminals,
        no_locations: x.no_locations,
        desired_funding_amount: x.desired_funding_amount
      })
    } else {
      setState({
        ...state,
        current_processing_company: '',
        monthly_card_sales: '',
        gross_monthly_sales: '',
        no_terminals: '',
        no_locations: '',
        desired_funding_amount: ''
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('business_detail', JSON.stringify(state))
    console.log('state in bd', state)
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
                  <span>Step 5 of 7</span>
                </div>
                <div
                  onClick={() => history.push('/business_property')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Processing Information
                  </h4>
                  <div className='row justify-content-center g-3'>
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <CountryDropdown
                          className='form-select form-control'
                          value={state.country}
                          valueType='short'
                          onChange={(val) => selectCountry(val)}
                        />
                        <div className='form-text'>{error.countryError}</div>
                        <span className='bar'></span>
                        <label htmlFor='countryofincorporation'>
                          Country of Incorporation{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                      </div>
                    </div> */}

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='current_processing_company'
                          id='current_processing_company'
                          onChange={handleInputChanged}
                          // onBlur={getCompanyData}
                          placeholder='Company Number'
                          autoComplete='off'
                          value={
                            state.current_processing_company == '.'
                              ? ''
                              : state.current_processing_company
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='current_processing_company'>
                          Current Processing Company
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.current_processing_company_error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='monthly_card_sales'
                          id='monthly_card_sales'
                          onChange={handleInputChanged}
                          placeholder='Company Name'
                          autoComplete='off'
                          value={
                            state.monthly_card_sales == '.'
                              ? ''
                              : state.monthly_card_sales
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='monthly_card_sales'>
                          Monthly Card Sales (previous 12 months average)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.monthly_card_sales_error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='gross_monthly_sales'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={
                            state.gross_monthly_sales == '.'
                              ? ''
                              : state.gross_monthly_sales
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          Gross Monthly Sales (previous 12 months average)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.gross_monthly_sales_error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='no_terminals'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={
                            state.no_terminals == '.' ? '' : state.no_terminals
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          No. of Terminals
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.no_terminals_error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='no_locations'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={
                            state.no_locations == '.' ? '' : state.no_locations
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          No. of Locations
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.no_locations_error}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='desired_funding_amount'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={
                            state.desired_funding_amount == '.'
                              ? ''
                              : state.desired_funding_amount
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          Desired Funding Amount
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.desired_funding_amount_error}
                        </div>
                      </div>
                    </div>

                    {/* <div className='col-md-12 col-xl-5'></div> */}
                    <div className='col-md-12 col-xl-5'>
                      <input
                        type='submit'
                        name='submit'
                        className='btn btn-primary w-100 btn-lg'
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

export default ProcessingInformation

//chrome.exe --disable-web-security --user-data-dir="c:/ChromeDevSession
