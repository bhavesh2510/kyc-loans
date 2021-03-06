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

const BusinessDetails = () => {
  const history = useHistory()
  let countryCode = ''
  let company = ''
  let country = ''

  const [error, setError] = useState({})
  //   const { country } = state;

  const x = JSON.parse(localStorage.getItem('previous_data'))

  const [state, setState] = useState({
    company_name: '',
    company_no: '',
    trading_address: '',
    type_entity: '',
    business_classification_type: ''
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
    if (!state.company_no || state.company_no == '.') {
      setError({ ...error, comp_regi_error: 'This field is required.' })
      validForm = false
    }
    if (!state.company_name || state.company_name == '.') {
      setError({ ...error, comp_name_error: 'This field is required.' })
      validForm = false
    }

    if (!state.trading_address || state.trading_address == '.') {
      setError({
        ...error,
        trading_error: 'This field is required.'
      })
      validForm = false
    }
    if (
      !state.business_classification_type ||
      state.business_classification_type == '.'
    ) {
      setError({ ...error, classification_error: 'This field is required.' })
      validForm = false
    }
    if (!state.type_entity || state.type_entity == '.') {
      setError({ ...error, entity_error: 'This field is required.' })
      validForm = false
    }

    if (validForm) {
      var axios = require('axios')
      const id = JSON.parse(localStorage.getItem('kyc_id'))

      const finalId = id == null ? x.id : id
      console.log('finalId is', finalId)
      var data = {
        id: `${finalId}`,
        company_no: `${state.company_no}`,
        company_name: `${state.company_name}`,
        trading_address: `${state.trading_address}`,
        business_classfication_type: `${state.business_classification_type}`,
        type_entity: `${state.type_entity}`,

        status: 'incomplete'
      }

      var config = {
        method: 'put',
        url: 'https://hrm.zotto.io/api/business-information',
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

          history.push('/principal_owner')
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
        if (response.data.Applicant) {
          localStorage.setItem(
            'ownership_data',
            JSON.stringify(response.data.Loans)
          )
        }
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
      comp_name_error: '',
      comp_regi_error: '',
      trading_error: '',
      entity_error: '',
      classification_error: ''
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

  const getCompanyData = (event) => {
    console.log('data in blur', event.target.value)
    const prev_data = JSON.parse(localStorage.getItem('add_user'))
    console.log('target name', event.target.name)
    if (event.target.name == 'companynumber') {
      if (state.country == 'DK') {
        var axios = require('axios')
        var data = JSON.stringify({
          email: `${prev_data.companyemail}`
        })

        var config = {
          method: 'get',
          url: `https://pay.cibopay.com/getData/cvrsearch/regnumber/${event.target.value}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
          },
          data: data
        }

        axios(config)
          .then(function (response) {
            console.log('response of new api', response)
            setState({
              ...state,
              companynumber: event.target.value,
              city: response.data.DATA.city,
              dateofincorporation: response.data.DATA.startdate,
              address1: response.data.DATA.address,

              post_code: response.data.DATA.zipcode,
              vatnumber: response.data.DATA.vat,

              company_name: response.data.DATA.name
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      } else if (state.country == 'GB') {
        var axios = require('axios')
        var data = JSON.stringify({
          email: `${prev_data.companyemail}`
        })

        var config = {
          mode: 'no-cors',
          method: 'get',
          url: `https://pay.cibopay.com/getData/search/regnumber/${event.target.value}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'ci_session=kihkhpchd8cv0ekcb39q5kll9f97begm'
          },
          data: data
        }

        axios(config)
          .then(function (response) {
            console.log('reg number', response.data.DATA)

            if (!response.data.DATA.errors) {
              setState({
                ...state,
                companynumber: response.data.DATA.company_number,
                dateofincorporation: response.data.DATA.date_of_creation,
                address1:
                  response.data.DATA.registered_office_address.address_line_1,
                city: response.data.DATA.registered_office_address.locality,
                post_code:
                  response.data.DATA.registered_office_address.postal_code,
                vatnumber: x.vat_number,

                company_name: response.data.DATA.company_name
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }

  const getFormData = (company) => {
    if (company && countryCode === 'DK') {
      Service.getData(countryCode, company)
        .then((response) => {
          localforage.removeItem('dk_comp_owners')
          localforage.setItem('dk_comp_owners', response.data.owners)
          if (!response.data.error) {
            setState({
              ...state,

              dateofincorporation: response.data.startdate
                ? response.data.startdate
                : '',
              address1: response.data.address ? response.data.address : '',
              city: response.data.city ? response.data.city : '',
              post_code: response.data.zipcode ? response.data.zipcode : '',
              vatnumber: response.data.vat ? response.data.vat : '',
              company_name: response.data.name ? response.data.name : ''
            })
          } else {
            setState({
              ...state,
              dateofincorporation: '',
              address1: '',
              city: '',
              post_code: '',
              vatnumber: '',
              company_name: ''
            })
          }
        })
        .catch((error) => {
          setState({
            ...state,
            dateofincorporation: '',
            address1: '',
            city: '',
            post_code: '',
            vatnumber: '',
            company_name: ''
          })
        })
    } else if (company && countryCode === 'GB') {
      localforage.removeItem('dk_comp_owners')
      Service.getData(countryCode, company)
        .then((response) => {
          if (!response.data.DATA.errors) {
            let addr_1 =
              response.data.DATA.registered_office_address.address_line_1 || ''
            let addr_2 =
              response.data.DATA.registered_office_address.address_line_2 || ''
            let postcode =
              response.data.DATA.registered_office_address.postal_code || ''
            let city =
              response.data.DATA.registered_office_address.locality || ''

            setState({
              ...state,

              companynumber: response.data.DATA.company_number,
              dateofincorporation: response.data.DATA.date_of_creation,
              address1:
                response.data.DATA.registered_office_address.address_line_1,

              post_code:
                response.data.DATA.registered_office_address.postal_code,
              vatnumber: x.vat_number,

              company_name: response.data.DATA.company_name
            })
          } else {
            setState({
              ...state,
              dateofincorporation: '',
              address1: '',
              address2: '',
              post_code: '',
              vatnumber: '',
              company_name: ''
            })
          }
        })
        .catch((error) => {
          setState({
            ...state,
            dateofincorporation: '',
            address1: '',
            address2: '',
            post_code: '',
            vatnumber: '',
            company_name: ''
          })
        })
    }
  }

  const selectCountry = (val) => {
    console.log('country val', val)
    setState({ ...state, country: val, countryError: '' })
    countryCode = val
    getFormData()
  }

  const setValues = (e) => {
    // let self = this;
    localforage
      .getItem('bus_data')
      .then(function (value) {
        countryCode = value.country
        setState({
          ...state,
          companynumber: value.companynumber,
          country: value.country,
          company_name: value.company_name,
          dateofincorporation: value.dateofincorporation,
          address1: value.address1,
          address2: value.address2,
          city: value.city,
          post_code: value.post_code,
          vatnumber: value.vatnumber,
          dbalegalname: value.dbalegalname,
          dbaaddress1: value.dbaaddress1,
          dbaaddress2: value.dbaaddress2,
          dbacity: value.dbacity,
          dbapost_code: value.dbapost_code,
          websitename: value.websitename
        })
      })
      .catch(function (err) {
        console.log(err)
      })
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
        company_name: x.company_name,
        company_no: x.company_no,
        trading_address: x.trading_address,
        type_entity: x.type_entity,
        business_classification_type: x.business_classfication_type
      })
    } else {
      setState({
        ...state,
        company_name: '',
        company_no: '',
        trading_address: '',
        type_entity: '',
        business_classification_type: ''
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
                  <span>Step 2 of 7</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Business Information
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
                          name='company_no'
                          id='company_no'
                          onChange={handleInputChanged}
                          // onBlur={getCompanyData}
                          placeholder='Company Number'
                          autoComplete='off'
                          value={
                            state.company_no == '.' ? '' : state.company_no
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='company_no'>
                          Company Number
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.comp_regi_error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='company_name'
                          id='company_name'
                          onChange={handleInputChanged}
                          placeholder='Company Name'
                          autoComplete='off'
                          value={
                            state.company_name == '.' ? '' : state.company_name
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='company_name'>
                          Company Name<strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.comp_name_error}</div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='trading_address'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={
                            state.trading_address == '.'
                              ? ''
                              : state.trading_address
                          }
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          Trading Address{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.trading_error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <select
                          defaultValue={'DEFAULT'}
                          className='form-select form-control'
                          name='business_classification_type'
                          autoComplete='off'
                          value={state.business_classification_type}
                          id='type'
                          onChange={handleInputChanged}
                          // onChange={handleTypeOfBusiness}
                          aria-label='Floating label select example'
                        >
                          <option value=''>Select Type</option>
                          <option value='pub'>Pub/Bar</option>
                          <option value='restaurant' name='restaurant'>
                            Restaurant
                          </option>
                          <option value='hotel'>Hotel/B&B</option>
                          <option value='hair'>Hair & Beauty</option>
                          <option value='others'>Others</option>
                        </select>
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='type'>
                          Business Classifications{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.classification_error}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <select
                          defaultValue={'DEFAULT'}
                          className='form-select form-control'
                          name='type_entity'
                          autoComplete='off'
                          value={state.type_entity}
                          id='type'
                          onChange={handleInputChanged}
                          // onChange={handleTypeOfBusiness}
                          aria-label='Floating label select example'
                        >
                          <option value=''>Select Type</option>
                          <option value='soleproprietor'>
                            Sole proprietor
                          </option>
                          <option value='partnership' name='retail'>
                            Partnership
                          </option>
                          <option value='limitedco'>Limited co</option>
                          <option value='other'>Other</option>
                        </select>
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='type'>
                          Type of Entity
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.entity_error}</div>
                      </div>
                    </div>
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='post_code'
                          autoComplete='off'
                          id='post_code'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          value={state.post_code}
                        />
                        <span className='bar'></span>
                        <label htmlFor='post_code'>
                          Post code <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.post_codeError}</div>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbalegalname'
                          id='dbalegalname'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.dbalegalname == 'null'
                              ? ' '
                              : state.dbalegalname
                          }
                          placeholder='DBA (Doing Business As. If different from Legal Name)'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbalegalname'>
                          DBA (Doing Business As. If different from Legal Name)
                        </label>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbaaddress1'
                          id='dbaaddress1'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.dbaaddress1 == 'null' ? '' : state.dbaaddress1
                          }
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbaaddress1'>DBA Address Line 1</label>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbaaddress2'
                          id='dbaaddress2'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.dbaaddress2 == 'null' ? '' : state.dbaaddress2
                          }
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbaaddress2'>DBA Address Line 2</label>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbacity'
                          id='dbacity'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbacity == 'null' ? '' : state.dbacity}
                          placeholder='DBA City'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbacity'>DBA City</label>
                        <div className='form-text'>{error.dbacityError}</div>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbapost_code'
                          id='dbapost_code'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.dbapost_code == 'null'
                              ? ''
                              : state.dbapost_code
                          }
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbapost_code'>DBA Post code</label>
                      </div>
                    </div> */}
                    {/* <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='url'
                          className='form-control'
                          name='websitename'
                          id='websitename'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.websitename == 'null' ? '' : state.websitename
                          }
                          placeholder='Website https://'
                        />
                        <span className='bar'></span>
                        <label htmlFor='websitename'>Website</label>
                      </div>
                    </div> */}
                    <div className='col-md-12 col-xl-5'></div>
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

export default BusinessDetails

//chrome.exe --disable-web-security --user-data-dir="c:/ChromeDevSession
