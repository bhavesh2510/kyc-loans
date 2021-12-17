import React, { Component, useEffect } from 'react'

import Service from '../services/service'
import $ from 'jquery'
import localforage from 'localforage'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
toast.configure()

var md5 = require('md5')

class CustomerDetails extends Component {
  constructor(props) {
    super(props)
    // create a ref to store the DOM element

    this.state = {
      companyemail: '',
      phonenumber: '',
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
      complete: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChanged = this.handleInputChanged.bind(this)
    this.sendEmailOTP = this.sendEmailOTP.bind(this)
    this.sendPhoneOTP = this.sendPhoneOTP.bind(this)
    this.verifyEmailOTP = this.verifyEmailOTP.bind(this)
    this.verifyMobileOTP = this.verifyMobileOTP.bind(this)

    console.log('state is', this.state)
  }

  handleSubmit(e) {
    const { history } = this.props
    var Email = this.state.companyemail
    localStorage.setItem('isLoggedIn', JSON.stringify(1))
    localStorage.setItem('add_user', JSON.stringify(this.state))
    console.log('state in final', this.state)
    const email = this.state.companyemail
    const phn = this.state.phonenumber
    e.preventDefault()
    history.push('/business_details')
    // if (this.state.companyemail === '') {
    //   this.setState({ emailError: 'Please enter a valid email.' })
    //   return
    // }
    // if (this.state.phonenumber === '') {
    //   this.setState({ phoneError: 'Please enter a mobile number.' })
    //   return
    // }
  }

  getData() {}

  async sendEmailOTP(e) {
    const result = await this.getData()
    var axios = require('axios')

    if (result == 'error') {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
          this.state.companyemail
        )
      ) {
        this.setState({ emailError: 'Please enter a valid email.' })
        return
      } else {
        this.setState({ emailError: '' })
      }

      var formData = new FormData()
      formData.append('email', this.state.companyemail)

      Service.emailOTP(formData)
        .then((response) => {
          console.log('response of otp', response)
          if (response.status === 200) {
            this.setState({
              emailOtpText: 'Resend',
              isEmailOTPSend: true,
              sendEmailOtp: response.data.data
            })
            toast.success('OTP has been sent.', {
              position: 'top-right',
              autoClose: 5000
            })
          }
          console.log('response of otp', this.state)
        })
        .catch((error) => {
          this.setState({ error: error.response })
        })
    } else {
      if (result.status == 'complete') {
        toast.success(
          'Your kyc is already completed. Our executive will get in touch with you soon.',
          {
            position: 'top-right',
            autoClose: 5000
          }
        )
      } else {
        // this.setState({
        //   emailOtpText: 'Resend',
        //   isEmailOTPSend: true,
        //   sendEmailOtp: '',
        // });
        // toast.success('OTP has been sent.', {
        //   position: 'top-right',
        //   autoClose: 5000,
        // });

        if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
            this.state.companyemail
          )
        ) {
          this.setState({ emailError: 'Please enter a valid email.' })
          return
        } else {
          this.setState({ emailError: '' })
        }

        var formData = new FormData()
        formData.append('email', this.state.companyemail)

        Service.emailOTP(formData)
          .then((response) => {
            console.log('response of otp', response)
            if (response.status === 200) {
              this.setState({
                emailOtpText: 'Resend',
                isEmailOTPSend: true,
                sendEmailOtp: response.data.data
              })
              toast.success('OTP has been sent.', {
                position: 'top-right',
                autoClose: 5000
              })
            }
            console.log('response of otp', this.state)
          })
          .catch((error) => {
            this.setState({ error: error.response })
          })
      }
    }
  }

  sendPhoneOTP(e) {
    // this.setState({
    //   phoneOtpText: 'Resend',
    //   isMobileOTPSend: true,
    //   sendMobileOtp: '',
    // });

    if (
      !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm.test(
        this.state.phonenumber
      ) ||
      this.state.phonenumber.length < 9
    ) {
      this.setState({ mobileError: 'Please enter a valid phone number.' })
      return
    } else {
      this.setState({ mobileError: '' })
    }
    var formData = new FormData()
    formData.append('mobile', '+' + this.state.phonenumber)

    Service.phoneOTP(formData)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
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
        this.setState({ error: error.response })
      })
  }

  verifyEmailOTP(e) {
    // this.setState({
    //   emailOTPVerified: true,
    //   emailOtpText: 'Confirmed',
    //   isEmailOTPSend: false,
    // });
    localStorage.setItem('Emailverified', true)
    if (this.state.sendEmailOtp === md5(this.state.userEmailotp)) {
      this.setState({
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

  verifyMobileOTP(e) {
    // this.setState({
    //   mobileOTPVerified: true,
    //   phoneOtpText: 'Confirmed',
    //   isMobileOTPSend: false,
    // });
    localStorage.setItem('Phoneverified', true)
    if (this.state.sendMobileOtp === md5(this.state.userMobileotp)) {
      this.setState({
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

  handleInputChanged(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    if (event.target.name === 'companyemail') {
      this.setState({
        isEmailOTPSend: false,
        emailOTPVerified: false,
        emailOtpText: 'Verify'
      })
    }
  }

  componentDidMount() {
    localStorage.clear()
    localforage.clear()
    localStorage.setItem('isLoggedIn', JSON.stringify(0)) //0
    Service.getIpData()
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            ip: response.data.ip,
            location:
              response.data.city +
              ',' +
              response.data.region +
              ',' +
              response.data.country_name
          })
        }
      })
      .catch((error) => {})
  }

  render() {
    return (
      <div className='content-box'>
        <div className='container-fluid h-100'>
          <div className='row justify-content-center align-items-center h-100'>
            <div className='col-sm-12 col-md-8 col-lg-7 col-xxl-5 py-4'>
              <div className='text-center steping'>
                <span>Step 1 of 6</span>
              </div>
              <h4 className='pb-4 fs-2 text-center fw-bold'>
                Customer Verification
              </h4>
              <form onSubmit={this.handleSubmit}>
                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    className='form-control form-otp'
                    name='companyemail'
                    id='companyemail'
                    placeholder='name@example.com'
                    onChange={this.handleInputChanged}
                    value={this.state.companyemail}
                    readOnly={this.state.emailOTPVerified ? true : false}
                  />
                  <label htmlFor='companyemail'>
                    Company Email <strong className='text-danger'>*</strong>
                  </label>
                  <span className='bar'></span>
                  <button
                    type='button'
                    className='btn btn-link px-1 text-decoration-none btn-sendotp email'
                    onClick={this.sendEmailOTP}
                    disabled={this.state.emailOTPVerified ? true : false}
                  >
                    {this.state.emailOtpText}
                  </button>
                  <div className='form-text'>{this.state.emailError}</div>
                </div>
                {this.state.emailOTPVerified ? (
                  <div className='form-floating form-floatingnumber form-floating-confirm mb-3'>
                    <PhoneInput
                      specialLabel='Phone Number'
                      inputClass='form-control form-otp'
                      inputProps={{
                        name: 'phonenumber',
                        readOnly: this.state.mobileOTPVerified ? true : false,
                        autoComplete: 'off'
                      }}
                      enableSearch='true'
                      country={'gb'}
                      placeholder='Phone Number'
                      value={this.state.phonenumber}
                      onChange={(phonenumber) =>
                        this.setState({
                          phonenumber,
                          isMobileOTPSend: false,
                          mobileOTPVerified: false,
                          phoneOtpText: 'Verify'
                        })
                      }
                    />
                    <span className='bar'></span>
                    <button
                      type='button'
                      className='btn btn-link px-1 text-decoration-none btn-sendotp phone'
                      onClick={this.sendPhoneOTP}
                      disabled={this.state.mobileOTPVerified ? true : false}
                    >
                      {this.state.phoneOtpText}{' '}
                    </button>
                    <div className='form-text'>{this.state.mobileError}</div>
                  </div>
                ) : (
                  ''
                )}
                {this.state.isEmailOTPSend ? (
                  <div className='form-floating mb-3'>
                    <input
                      type='text'
                      className='form-control form-otp'
                      name='userEmailotp'
                      placeholder='Enter Email OTP'
                      onChange={this.handleInputChanged}
                    />
                    <label htmlFor='otpfield'>Enter Email OTP</label>
                    <span className='bar'></span>
                    <button
                      type='button'
                      className='btn btn-link px-1 text-decoration-none btn-sendotp'
                      onClick={this.verifyEmailOTP}
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  ''
                )}
                {this.state.isMobileOTPSend ? (
                  <div className='form-floating mb-3'>
                    <input
                      type='text'
                      className='form-control form-otp'
                      name='userMobileotp'
                      placeholder='Enter OTP'
                      onChange={this.handleInputChanged}
                    />
                    <label htmlFor='otpfield'>Enter Mobile OTP</label>
                    <span className='bar'></span>
                    <button
                      type='button'
                      className='btn btn-link px-1 text-decoration-none btn-sendotp'
                      onClick={this.verifyMobileOTP}
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  ''
                )}
                {/* {this.state.emailOTPVerified && this.state.mobileOTPVerified ? (
                  <button
                    type='submit'
                    className='btn btn-primary w-100 btn-lg'
                  >
                    Submit
                  </button>
                ) : ( */}
                <button className='btn btn-primary w-100 btn-lg'>Submit</button>
                {/* )} */}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default CustomerDetails
