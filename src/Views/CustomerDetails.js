import React, { Component, useEffect, useState } from 'react'

import Service from '../services/service'
import $ from 'jquery'
import localforage from 'localforage'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router'
import notAuthor from './error.svg'
import moment from 'moment'
import Geocode from 'react-geocode'
Geocode.setApiKey('AIzaSyCMTj6FEwu3Kh0tSdgp6hh4QOKgIJF74rs')
toast.configure()

var md5 = require('md5')

const CustomerDetails = () => {
  const history = useHistory()
  const [showKyc, setshowKyc] = useState(true)
  const [companyId, setcompanyId] = useState()
  const [state, setState] = useState({
    companyemail: '',
    phonenumber: '',
    phone_code: '',
    isEmailOTPSend: false,
    isMobileOTPSend: false,
    sendMobileOtp: '',
    sendEmailOtp: '',
    userEmailotp: '',
    userMobileotp: '',
    emailOTPVerified: false,
    mobileOTPVerified: false,
    phoneOtpText: 'Verify',
    emailOtpText: 'Verify',
    ip: '',
    location: '',
    complete: false,
    showKyc: ''
  })

  const handleSubmit = (e) => {
    // const { history } = useHistory()
    // const { history } = props
    var Email = state.companyemail
    localStorage.setItem('isLoggedIn', JSON.stringify(1))
    localStorage.setItem('add_user', JSON.stringify(state))
    console.log('state in final', state)
    const email = state.companyemail
    const phn = state.phonenumber
    e.preventDefault()

    if (state.companyemail === '') {
      setState({ ...state, emailError: 'Please enter a valid email.' })
      return
    }
    if (state.phonenumber === '') {
      setState({ ...state, phoneError: 'Please enter a mobile number.' })
      return
    }
    // var axios = require("axios");
    // const PostDetails = {
    //   // ip: state.ip,
    //   // location: state.location,
    //   // email: state.companyemail,
    //   // comp_phone_no: state.phonenumber,
    // };
    var axios = require('axios')
    var moment = require('moment-timezone')
    var timezone = JSON.parse(localStorage.getItem('timezone'))
    var tm = moment.tz(moment(), `${timezone}`).format('LTS')
    var sliced = state.phonenumber.slice(state.phone_code.length)
    var dt = moment().format('DD-MM-YYYY')
    var loc = state.location ? state.location : '.'

    var data = {
      company_no: '.',
      company_name: '.',
      company_email: `${state.companyemail}`,
      comp_phone_code: `${state.phone_code}`,
      comp_phone_no: `${sliced}`,
      trading_address: '.',
      business_classfication_type: '.',
      type_entity: '.',
      property_information: '.',
      monthly_rent: '.',
      lease_end_date: '.',
      landlord_name: '.',
      current_processing_company: '.',
      monthly_card_sales: '.',
      gross_monthly_sales: '.',
      no_terminals: '.',
      no_locations: '.',
      desired_funding_amount: '.',
      ans1: '.',
      ans2: '.',
      ans3: '.',
      ans4: '.',
      ans5: '.',
      ans6: '.',
      ans7: '.',
      ans8: '.',
      // proof_card_statement: '',
      name: '.',
      company_id: `${companyId}`,
      location: `${loc}`,
      created_at: `${dt} ${tm}`,
      status: 'incomplete'
    }
    console.log('data final', data)

    var config = {
      method: 'post',
      mode: 'no-cors',
      url: 'https://hrm.zotto.io/api/loans-add',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ'
      },
      data: data
    }

    axios(config)
      .then(function (response) {
        console.log('response of add', response)

        localStorage.setItem('kyc_id', JSON.stringify(response.data.Loan_id))
        toast.success('Successfully Registered', {
          position: 'top-right',
          autoClose: 5000
        })

        // localStorage.setItem('isLoggedIn', JSON.stringify(1));

        history.push(`/business_details`)
      })
      .catch(function (error) {
        console.log('response of add', error.response)
        if (error.response.status == 400) {
          toast.error('Something went wrong', {
            position: 'top-right',
            autoClose: 5000
          })
        } else {
          toast.error('Email or phone is already registered.', {
            position: 'top-right',
            autoClose: 5000
          })
          history.push(`/business_details`)
        }

        console.log('state in catch', email, phn)
        // localStorage.setItem('isLoggedIn', JSON.stringify(1));
        // history.push(`/business_details`)
      })

    //get data
  }

  const getData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        var axios = require('axios')
        var getData = JSON.stringify({
          company_email: `${state.companyemail}`,
          company_id: `${companyId}`
        })

        console.log('json data', getData)

        var config = {
          method: 'post',
          mode: 'no-cors',
          url: 'https://hrm.zotto.io/api/loans-get',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },

          data: getData
        }

        axios(config)
          .then(function (response) {
            console.log('response of get', response.data)
            resolve(response.data.Loans)
            localStorage.setItem(
              'previous_data',
              JSON.stringify(response.data.Loans)
            )
          })
          .catch(function (error) {
            var prevdata = {
              ans1: null,
              ans2: null,
              ans3: null,
              ans4: null,
              ans5: null,
              ans6: null,
              ans7: null,
              ans8: null,
              business_classfication_type: null,
              comp_phone_code: null,
              comp_phone_no: null,
              company_email: null,
              company_id: null,
              company_name: null,
              company_no: null,
              created_at: null,
              current_processing_company: null,
              desired_funding_amount: null,
              gross_monthly_sales: null,
              landlord_name: null,
              lease_end_date: null,
              location: null,
              monthly_card_sales: null,
              monthly_rent: null,
              name: null,
              no_locations: null,
              no_terminals: null,
              property_information: null,
              status: 'incomplete',
              trading_address: null,
              type_entity: null
            }
            localStorage.setItem('previous_data', JSON.stringify(prevdata))
            resolve('error')
          })
      }, 2000)
    })
  }

  const sendEmailOTP = async (e) => {
    const result = await getData()
    console.log('loans is', result)
    var axios = require('axios')
    // var result = {
    //   status: ''
    // }

    if (result == 'error') {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(state.companyemail)
      ) {
        setState({ ...state, emailError: 'Please enter a valid email.' })
        return
      } else {
        setState({ ...state, emailError: '' })
      }

      var formData = new FormData()
      formData.append('email', state.companyemail)

      Service.emailOTP(formData)
        .then((response) => {
          console.log('response of otp', response)
          if (response.status === 200) {
            setState({
              ...state,
              emailOtpText: 'Resend',
              isEmailOTPSend: true,
              sendEmailOtp: response.data.data
            })
            toast.success('OTP has been sent.', {
              position: 'top-right',
              autoClose: 5000
            })
          }
          console.log('response of otp', state)
        })
        .catch((error) => {
          setState({ ...state, error: error.response })
        })
    } else {
      if (result.status == 'complete') {
        toast.success(
          'Your loan application is already completed. Our executive will get in touch with you soon.',
          {
            position: 'top-right',
            autoClose: 5000
          }
        )
      } else {
        // setState({
        //   emailOtpText: 'Resend',
        //   isEmailOTPSend: true,
        //   sendEmailOtp: '',
        // });
        // toast.success('OTP has been sent.', {
        //   position: 'top-right',
        //   autoClose: 5000,
        // });

        if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(state.companyemail)
        ) {
          setState({ ...state, emailError: 'Please enter a valid email.' })
          return
        } else {
          setState({ ...state, emailError: '' })
        }

        var formData = new FormData()
        formData.append('email', state.companyemail)

        Service.emailOTP(formData)
          .then((response) => {
            console.log('response of otp', response)
            if (response.status === 200) {
              setState({
                ...state,
                emailOtpText: 'Resend',
                isEmailOTPSend: true,
                sendEmailOtp: response.data.data
              })
              toast.success('OTP has been sent.', {
                position: 'top-right',
                autoClose: 5000
              })
            }
            console.log('response of otp', state)
          })
          .catch((error) => {
            setState({ error: error.response })
          })
      }
    }
  }

  const sendPhoneOTP = (e) => {
    // setState({
    //   phoneOtpText: 'Resend',
    //   isMobileOTPSend: true,
    //   sendMobileOtp: '',
    // });

    if (
      !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm.test(
        state.phonenumber
      ) ||
      state.phonenumber.length < 9
    ) {
      setState({ ...state, mobileError: 'Please enter a valid phone number.' })
      return
    } else {
      setState({ ...state, mobileError: '' })
    }
    var formData = new FormData()
    formData.append('mobile', '+' + state.phonenumber)

    Service.phoneOTP(formData)
      .then((response) => {
        if (response.status === 200) {
          setState({
            ...state,
            phoneOtpText: 'Resend',
            isMobileOTPSend: true,
            sendMobileOtp: response.data.data
          })
          toast.success('OTP has been sent.', {
            position: 'top-right',
            autoClose: 5000
          })
        }
      })
      .catch((error) => {
        setState({ ...state, error: error.response })
      })
  }

  const verifyEmailOTP = (e) => {
    // this.setState({
    //   emailOTPVerified: true,
    //   emailOtpText: 'Confirmed',
    //   isEmailOTPSend: false,
    // });
    localStorage.setItem('Emailverified', true)
    if (state.sendEmailOtp === md5(state.userEmailotp)) {
      setState({
        ...state,
        emailOTPVerified: true,
        emailOtpText: 'Confirmed',
        isEmailOTPSend: false
      })
      localStorage.setItem('Emailverified', true)
      $('.btn-sendotp.email').attr('disabled', true)
      toast.success('Email has been verified.', {
        position: 'top-right',
        autoClose: 5000
      })
    } else {
      toast.error('Please enter correct OTP to verify email.', {
        position: 'top-right',
        autoClose: 5000
      })
    }
  }

  const verifyMobileOTP = (e) => {
    // setState({
    //   mobileOTPVerified: true,
    //   phoneOtpText: 'Confirmed',
    //   isMobileOTPSend: false,
    // });
    localStorage.setItem('Phoneverified', true)
    if (state.sendMobileOtp === md5(state.userMobileotp)) {
      setState({
        ...state,
        mobileOTPVerified: true,
        phoneOtpText: 'Confirmed',
        isMobileOTPSend: false
      })
      localStorage.setItem('Phoneverified', true)
      $('.btn-sendotp.phone').attr('disabled', true)
      toast.success('Phone number has been verified.', {
        position: 'top-right',
        autoClose: 5000
      })
      $('.btn-sendotp.phone').show()
    } else {
      toast.error('Please enter correct OTP to verify phone number.', {
        position: 'top-right',
        autoClose: 5000
      })
    }
  }

  const handleInputChanged = (event) => {
    setState({ ...state, [event.target.name]: event.target.value })
    if (event.target.name === 'companyemail') {
      setState({
        ...state,
        companyemail: event.target.value,
        isEmailOTPSend: false,
        emailOTPVerified: false,
        emailOtpText: 'Verify'
      })
    }
  }

  useEffect(() => {
    localStorage.clear()
    localforage.clear()
    localStorage.setItem('isLoggedIn', JSON.stringify(0)) //0
    navigator.geolocation.getCurrentPosition(async function (position) {
      if (position.coords.latitude && position.coords.longitude) {
        const response = await Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        )
        const address = response.results[0].formatted_address
        setState({ ...state, location: address || '.' })
      } else {
        Service.getIpData()
          .then((response) => {
            console.log('api resp', response)
            if (response.status === 200) {
              setState({
                ...state,
                ip: response.data.IPv4,
                location:
                  response.data.city +
                    ',' +
                    response.data.state +
                    ',' +
                    response.data.country_name || '.'
              })
            }
          })
          .catch((error) => {})
      }
    })

    const queryString = require('query-string')
    let parsed = queryString.parse(window.location.search)
    console.log('response of', parsed)
    if (!parsed.id) {
      parsed = {
        id: '1'
      }
    }

    var axios = require('axios')
    var config = {
      method: 'get',
      url: `https://hrm.zotto.io/api/getcompanies/${parsed.id}`,
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
        'Content-Type': 'application/json'
      }
    }

    axios(config)
      .then(function (response) {
        console.log('response of logo api', response)
        setcompanyId(response.data.Compdetails.id)
        localStorage.setItem(
          'timezone',
          JSON.stringify(response.data.Compdetails.timezone)
        )
      })
      .catch(function (error) {
        setshowKyc(false)
      })
  }, [])

  useEffect(() => {
    console.log('state is', state)
  }, [state])

  return (
    <>
      <div className='content-box'>
        <div className='container-fluid h-100'>
          <div className='row justify-content-center align-items-center h-100'>
            {showKyc ? (
              <>
                <div className='col-sm-12 col-md-8 col-lg-7 col-xxl-5 py-4'>
                  <div className='text-center steping'>
                    <span>Step 1 of 7</span>
                  </div>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Customer Verification
                  </h4>
                  <form onSubmit={handleSubmit}>
                    <div className='form-floating mb-3'>
                      <input
                        type='email'
                        className='form-control form-otp'
                        name='companyemail'
                        id='companyemail'
                        placeholder='name@example.com'
                        onChange={handleInputChanged}
                        value={state.companyemail}
                        readOnly={state.emailOTPVerified ? true : false}
                      />
                      <label htmlFor='companyemail'>
                        Company Email <strong className='text-danger'>*</strong>
                      </label>
                      <span className='bar'></span>
                      <button
                        type='button'
                        className='btn btn-link px-1 text-decoration-none btn-sendotp email'
                        onClick={sendEmailOTP}
                        disabled={state.emailOTPVerified ? true : false}
                      >
                        {state.emailOtpText}
                      </button>
                      <div className='form-text'>{state.emailError}</div>
                    </div>
                    {state.emailOTPVerified ? (
                      <div className='form-floating form-floatingnumber form-floating-confirm mb-3'>
                        <PhoneInput
                          specialLabel='Phone Number'
                          inputClass='form-control form-otp'
                          inputProps={{
                            name: 'phonenumber',
                            readOnly: state.mobileOTPVerified ? true : false,
                            autoComplete: 'off'
                          }}
                          enableSearch='true'
                          country={'gb'}
                          placeholder='Phone Number'
                          value={state.phonenumber}
                          onChange={(phone_number, value, data) => {
                            var phh = phone_number.slice(value.dialCode)
                            setState({
                              ...state,
                              phonenumber: phone_number,
                              phone_code: value.dialCode,
                              isMobileOTPSend: false,
                              mobileOTPVerified: false,
                              phoneOtpText: 'Verify'
                            })
                          }}
                        />
                        <span className='bar'></span>
                        <button
                          type='button'
                          className='btn btn-link px-1 text-decoration-none btn-sendotp phone'
                          onClick={sendPhoneOTP}
                          disabled={state.mobileOTPVerified ? true : false}
                        >
                          {state.phoneOtpText}{' '}
                        </button>
                        <div className='form-text'>{state.mobileError}</div>
                      </div>
                    ) : (
                      ''
                    )}
                    {state.isEmailOTPSend ? (
                      <div className='form-floating mb-3'>
                        <input
                          type='text'
                          className='form-control form-otp'
                          name='userEmailotp'
                          placeholder='Enter Email OTP'
                          onChange={handleInputChanged}
                        />
                        <label htmlFor='otpfield'>Enter Email OTP</label>
                        <span className='bar'></span>
                        <button
                          type='button'
                          className='btn btn-link px-1 text-decoration-none btn-sendotp'
                          onClick={verifyEmailOTP}
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      ''
                    )}
                    {state.isMobileOTPSend ? (
                      <div className='form-floating mb-3'>
                        <input
                          type='text'
                          className='form-control form-otp'
                          name='userMobileotp'
                          placeholder='Enter OTP'
                          onChange={handleInputChanged}
                        />
                        <label htmlFor='otpfield'>Enter Mobile OTP</label>
                        <span className='bar'></span>
                        <button
                          type='button'
                          className='btn btn-link px-1 text-decoration-none btn-sendotp'
                          onClick={verifyMobileOTP}
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      ''
                    )}
                    {state.emailOTPVerified && state.mobileOTPVerified ? (
                      <button
                        type='submit'
                        className='btn btn-primary w-100 btn-lg'
                      >
                        Submit
                      </button>
                    ) : (
                      <button className='btn btn-primary w-100 btn-lg' disabled>
                        Submit
                      </button>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className='misc-inner p-2 p-sm-3'>
                  <div className='w-100 text-center'>
                    <h2 className='mb-1'>You are not authorized! 🔐</h2>

                    <img
                      className='img-fluid'
                      style={{ height: '400px', width: '400px' }}
                      src={notAuthor}
                      alt='Not authorized page'
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default CustomerDetails
