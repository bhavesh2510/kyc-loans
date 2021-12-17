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
    current_process_company: '',
    monthly_card_sales: '',
    monthly_cash_sales: '',
    no_of_terminals: '',
    no_of_locations: '',
    desired_funding_amount: ''
  })

  useEffect(() => {
    // if (x) {
    //   country = x.country_Incorporation;
    //   setState({
    //     ...state,
    //     companynumber: x.company_number,
    //     dateofincorporation: x.incorporation_date,
    //     address1: x.address1,
    //     city: x.city,
    //     post_code: x.post_code,
    //     vatnumber: x.vat_number,
    //     dbalegalname: x.dbalegalname,
    //     dbaaddress: '',
    //     websitename: x.website,
    //     country: x.country_Incorporation,
    //     company_name: x.company_name,
    //   });
    // }
  }, [])

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
    history.push('/merchant_question')
    return

    if (!state.current_process_company) {
      setError({
        ...error,
        current_process_company_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.monthly_card_sales) {
      setError({
        ...error,
        monthly_card_sales_error: 'This field is required.'
      })
      validForm = false
    }

    if (!state.monthly_cash_sales) {
      setError({
        ...error,
        monthly_cash_sales_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.no_of_terminals) {
      setError({ ...error, no_of_terminals_error: 'This field is required.' })
      validForm = false
    }
    if (!state.no_of_locations) {
      setError({ ...error, no_of_locations_error: 'This field is required.' })
      validForm = false
    }
    if (!state.desired_funding_amount) {
      setError({
        ...error,
        desired_funding_amount_error: 'This field is required.'
      })
      validForm = false
    }

    if (validForm) {
      history.push('/merchant_question')
    }
  }

  const handleInputChanged = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
    setError({
      ...error,
      current_process_company_error: '',
      monthly_card_sales_error: '',
      monthly_cash_sales_error: '',
      no_of_terminals_error: '',
      no_of_locations_error: '',
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
    // if (x) {
    //   setState({
    //     ...state,
    //     companynumber: x.company_number,
    //     dateofincorporation: x.incorporation_date,
    //     address1: x.address1,
    //     city: x.city,
    //     post_code: x.post_code,
    //     vatnumber: x.vat_number,
    //     dbalegalname: x.dba,
    //     dbaaddress: x.dbaaddress,
    //     dbaaddress1: x.dbaaddress1,
    //     dbaaddress2: x.dbaaddress1,
    //     dbacity: x.dbacity,
    //     websitename: x.websitename,
    //     country: x.country_Incorporation,
    //     company_name: x.company_name,
    //   });
    // } else {
    //   setState({
    //     ...state,
    //     companynumber: '',
    //     dateofincorporation: '',
    //     address1: '',
    //     city: '',
    //     post_code: '',
    //     vatnumber: '',
    //     dbalegalname: '',
    //     dbaaddress: '',
    //     dbaaddress1: '',
    //     dbaaddress2: '',
    //     dbacity: '',
    //     websitename: '',
    //     country: '',
    //     company_name: '',
    //   });
    // }
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
                  <span>Step 5 of 6</span>
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
                          name='current_process_company'
                          id='current_process_company'
                          onChange={handleInputChanged}
                          // onBlur={getCompanyData}
                          placeholder='Company Number'
                          autoComplete='off'
                          value={state.current_process_company}
                        />
                        <span className='bar'></span>
                        <label htmlFor='current_process_company'>
                          Current Processing Company
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.current_process_company_error}
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
                          value={state.monthly_card_sales}
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
                          name='monthly_cash_sales'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={state.monthly_cash_sales}
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          Gross Monthly Sales (previous 12 months average)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.monthly_cash_sales_error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='no_of_terminals'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={state.no_of_terminals}
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          No. of Terminals
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.no_of_terminals_error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='no_of_locations'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={state.no_of_locations}
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          No. of Locations
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.no_of_locations_error}
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
                          value={state.desired_funding_amount}
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
