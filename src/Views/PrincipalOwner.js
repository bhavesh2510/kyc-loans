import React, { Component } from 'react'
import Service from '../services/service'
import localforage from 'localforage'
import { toast } from 'react-toastify'
import RestrictUser from './RestrictUser'
import ShortUniqueId from 'short-unique-id'

class PrincipalOwner extends Component {
  constructor(props) {
    super(props)
    // create a ref to store the DOM element
    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    const shortid = require('shortid')

    this.state = {
      id: localStorage.getItem('insert_id'),
      restrict: y == 0 ? false : true,
      shareholders: [
        {
          fullname: '',
          fullnameError: '',
          lenght_business_ownership: '',
          add_line1: '',
          add_line2: '.',
          city: '',
          state: '',
          postal_zipcode: '',
          country: '',
          dob: '',
          nationality: '',
          email: '',
          phone: '',
          home: '',
          unique_id: shortid.generate()
        }
      ]
    }
  }

  handleInputChange = (idx) => (evt) => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder
      return {
        ...shareholder,
        [evt.target.name]: evt.target.value,
        [evt.target.name + 'Error']: ''
      }
    })
    console.log('new share', newShareholders)
    this.setState({ shareholders: newShareholders })
  }

  handleCheckBoxChange = (idx) => (evt) => {
    const roles = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder
      return { ...shareholder, [evt.target.name]: evt.target.checked }
    })
    this.setState({ shareholders: roles })
  }

  handleSubmit = (evt) => {
    const { history } = this.props
    const x = JSON.parse(localStorage.getItem('previous_data'))
    evt.preventDefault()
    const kycId = JSON.parse(localStorage.getItem('kyc_id'))
    var invalidForm = false
    const errors = this.state.shareholders.map(function (shareholder, idx) {
      if (!shareholder.fullname || /\d/.test(shareholder.fullname)) {
        invalidForm = true
        return {
          ...shareholder,
          fullnameError: 'Please enter a valid value.'
        }
      }
      if (!shareholder.lenght_business_ownership) {
        invalidForm = true
        return {
          ...shareholder,
          lenght_business_ownershipError: 'This field is required.'
        }
      } else if (shareholder.lenght_business_ownership < 25) {
        invalidForm = true
        return {
          ...shareholder,
          lenght_business_ownershipError:
            'Shareholder Percentage must be grater than or equal to 25.'
        }
      }
      if (!shareholder.add_line1) {
        invalidForm = true
        return { ...shareholder, add_line1Error: 'This field is required.' }
      }
      if (!shareholder.city) {
        invalidForm = true
        return { ...shareholder, cityError: 'This field is required.' }
      }
      // if (!shareholder.state) {
      //   invalidForm = true
      //   return { ...shareholder, stateError: 'This field is required.' }
      // }
      if (!shareholder.postal_zipcode) {
        invalidForm = true
        return {
          ...shareholder,
          postal_zipcodeError: 'This field is required.'
        }
      }
      // if (!shareholder.country) {
      //   invalidForm = true
      //   return { ...shareholder, countryError: 'This field is required.' }
      // }
      if (!shareholder.dob) {
        invalidForm = true
        return {
          ...shareholder,
          dobError: 'This field is required.'
        }
      }
      // if (!shareholder.nationality) {
      //   invalidForm = true
      //   return { ...shareholder, nationalityError: 'This field is required.' }
      // }
      if (!shareholder.home || shareholder.home == 'select') {
        invalidForm = true
        return { ...shareholder, homeError: 'This field is required.' }
      }
      if (!shareholder.email) {
        invalidForm = true
        return { ...shareholder, emailError: 'This field is required.' }
      }
      if (
        !shareholder.phone ||
        !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm.test(
          shareholder.phone
        )
      ) {
        invalidForm = true
        return {
          ...shareholder,
          phoneError: 'Please enter a valid value.'
        }
      }
      return shareholder
    })

    if (invalidForm) {
      this.setState({ shareholders: errors })
      return false
    }
    var total_share = 0
    this.state.shareholders.map(function (shareholder, idx) {
      if (shareholder.lenght_business_ownership !== '') {
        total_share =
          total_share + parseInt(shareholder.lenght_business_ownership)
      }
      return true
    })
    if (total_share !== 100) {
      toast.error(
        'Shareholder information missing, the total percentage should be 100.',
        {
          position: 'top-right',
          autoClose: 5000
        }
      )
      return false
    }

    const shareholders = this.state
    const shortid = require('shortid')

    console.log('data of share', shareholders)
    const y = JSON.parse(localStorage.getItem('add_user'))

    const arrayData = []

    console.log('kyc id is', kycId)
    const id = JSON.parse(localStorage.getItem('kyc_id'))
    // console.log('x is', y);
    const finalId = id == null ? x.id : id
    var moment = require('moment-timezone')
    var timezone = JSON.parse(localStorage.getItem('timezone'))
    var tm = moment.tz(moment(), `${timezone}`).format('LTS')

    var dt = moment().format('YYYY-MM-DD')

    this.state.shareholders.map((currentvalue) => {
      let add_2 = currentvalue.add_line2 == '' ? '.' : currentvalue.add_line2
      let state = currentvalue.state == '' ? '.' : currentvalue.state
      let country = currentvalue.country == '' ? '.' : currentvalue.country
      arrayData.push({
        laons_id: `${finalId}`,
        fullname: `${currentvalue.fullname}`,
        dob: `${currentvalue.dob}`,
        lenght_business_ownership: `${currentvalue.lenght_business_ownership}`,
        email: `${currentvalue.email}`,
        phone: `${currentvalue.phone}`,
        add_line1: `${add_2}`,
        add_line2: `${currentvalue.add_line2}`,
        city: `${currentvalue.city}`,
        state: `${state}`,
        postal_zipcode: `${currentvalue.postal_zipcode}`,
        country: `${country}`,
        home: `${currentvalue.home}`,
        unique_id: `${
          currentvalue.unique_id ? currentvalue.unique_id : shortid.generate()
        }`,
        created_at: `${dt} ${tm}`
      })
    })

    console.log('array data', arrayData)

    var axios = require('axios')

    var config = {
      method: 'post',
      url: 'https://hrm.zotto.io/api/applicant-add',
      mode: 'no-cors',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      data: arrayData
    }

    axios(config)
      .then(function (response) {
        console.log('response of add', response)
        toast.success('Successfully Registered', {
          position: 'top-right',
          autoClose: 5000
        })
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
            localStorage.setItem(
              'ownership_data',
              JSON.stringify(response.data.Applicant)
            )
          })
          .catch(function (error) {
            console.log('error of get', error)
          })

        history.push('/business_property')
      })
      .catch(function (error) {
        console.log('in error', error)
        //setState({ error: error });
        toast.error('Something went wrong !!')
      })

    // Service.update(shareholders)
    //   .then((response) => {
    //     if (response.data.status === 200) {
    //       localforage.setItem('owner_data', this.state.shareholders);
    //       this.props.history.push('/documents_declaration');
    //     }
    //     if (response.data.status === 500) {
    //       let messageObj = response.data.message;
    //       messageObj.map((message) => toast.error(message));
    //     }
    //   })
    //   .catch((error) => {
    //     this.setState({ error: error.response });
    //     toast.error('Something went wrong !!');
    //   });
  }

  totalPercentage = () => {
    var total_share = 0
    this.state.shareholders.map(function (shareholder, idx) {
      if (shareholder.percentage !== '') {
        total_share = total_share + parseInt(shareholder.percentage)
      }
      return true
    })
    var x = document.getElementById('add-morefields')
    if (x) {
      if (total_share > 99) {
        x.style.display = 'none'
      } else {
        x.style.display = 'block'
      }
    }
  }

  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          fullname: '',
          fullnameError: '',
          lenght_business_ownership: '',
          add_line1: '',
          add_line2: '.',
          city: '',
          state: '',
          postal_zipcode: '',
          country: '',
          dob: '',
          nationality: '',
          email: '',
          phone: '',
          home: ''
        }
      ])
    })
  }

  handleRemoveShareholder = (idx, shareholder_id) => () => {
    // this.setState({
    //   shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    // })
    var axios = require('axios')
    var data = JSON.stringify({
      email: 'singhbhavesh609@gmail.com'
    })

    var config = {
      method: 'delete',
      url: `https://hrm.zotto.io/api/applicant-delete/${shareholder_id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data))
      })
      .catch(function (error) {
        console.log(error)
      })
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    })
  }

  async getFormData() {
    var stateData = []
    try {
      stateData = await localforage.getItem('owner_data')
    } catch (err) {
      console.log(err)
    }

    var countryOfIncorporation = localStorage.getItem('countryOfIncorporation')

    let shareholderper = ''
    let email = ''
    let pass_number = ''
    let phone_number = ''
    let ben_owner = ''
    let dir = ''
    let auth_signatory = ''
    let addr_1 = ''
    let addr_2 = ''
    let country = ''
    let postcode = ''
    let city = ''
    let nationality = ''

    if (countryOfIncorporation == 'GB') {
      var companyNumber = localStorage.getItem('company_number')
      Service.getShareHolder(companyNumber)
        .then((response) => {
          if (!response.data.error) {
            if (response.data.DATA.items.length > 0) {
              for (let i = 0; i < response.data.DATA.items.length; i++) {
                addr_1 = response.data.DATA.items[i].address.address_line_1
                addr_2 = response.data.DATA.items[i].address.address_line_2
                country = response.data.DATA.items[i].address.country
                postcode = response.data.DATA.items[i].address.postal_code
                city = response.data.DATA.items[i].address.locality

                if (stateData && stateData[i]) {
                  shareholderper = stateData[i].lenght_business_ownership
                  email = stateData[i].emailid
                  pass_number = stateData[i].passportnumber
                  phone_number = stateData[i].phone
                  ben_owner = stateData[i].beneficial_owner
                  dir = stateData[i].director
                  auth_signatory = stateData[i].authorised_signatory
                } else {
                  shareholderper = ''
                  email = ''
                  pass_number = ''
                  phone_number = ''
                  ben_owner = ''
                  dir = ''
                  auth_signatory = ''
                }

                if (i === 0) {
                  this.setState({
                    shareholders: [
                      {
                        name: response.data.DATA.items[i].name,
                        nationality: response.data.DATA.items[i].nationality,
                        add_line1: addr_1,
                        add_line2: addr_2,
                        city: city,
                        postal_zipcode: postcode,
                        country: country,
                        lenght_business_ownership: shareholderper,
                        email: email,
                        passport_number: pass_number,
                        phone: phone_number,
                        beneficial_owner: ben_owner,
                        director: dir,
                        authorised_signatory: auth_signatory
                      }
                    ]
                  })
                }
                if (i > 0) {
                  this.setState({
                    shareholders: this.state.shareholders.concat([
                      {
                        name: response.data.DATA.items[i].name,
                        nationality: response.data.DATA.items[i].nationality,
                        add_line1: addr_1,
                        add_line2: addr_2,
                        city: city,
                        postal_zipcode: postcode,
                        country: country,
                        percentage: shareholderper,
                        email: email,
                        passport_number: pass_number,
                        phone: phone_number,
                        beneficial_owner: ben_owner,
                        director: dir,
                        authorised_signatory: auth_signatory
                      }
                    ])
                  })
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    if (countryOfIncorporation == 'DK') {
      try {
        var dkOwner = await localforage.getItem('dk_comp_owners')

        for (let i = 0; i < dkOwner.length; i++) {
          if (stateData) {
            shareholderper = stateData[i].lenght_business_ownership
            email = stateData[i].emailid
            pass_number = stateData[i].passportnumber
            phone_number = stateData[i].phone
            ben_owner = stateData[i].beneficial_owner
            dir = stateData[i].director
            auth_signatory = stateData[i].authorised_signatory
            nationality = stateData[i].nationality
            addr_1 = stateData[i].add_line1
            addr_2 = stateData[i].add_line2
            country = stateData[i].country
            postcode = stateData[i].postal_zipcode
            city = stateData[i].city
          }
          if (i === 0) {
            this.setState({
              shareholders: [
                {
                  name: dkOwner[i].name,
                  nationality: nationality,
                  add_line1: addr_1,
                  add_line2: addr_2,
                  city: city,
                  postal_zipcode: postcode,
                  country: country,
                  percentage: shareholderper,
                  email: email,
                  passport_number: pass_number,
                  phone: phone_number,
                  beneficial_owner: ben_owner,
                  director: dir,
                  authorised_signatory: auth_signatory
                }
              ]
            })
          }
          if (i > 0) {
            this.setState({
              shareholders: this.state.shareholders.concat([
                {
                  name: dkOwner[i].name,
                  percentage: shareholderper,
                  email: email,
                  passport_number: pass_number,
                  phone: phone_number,
                  beneficial_owner: ben_owner,
                  director: dir,
                  authorised_signatory: auth_signatory
                }
              ])
            })
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  x
  componentDidMount() {
    const x = JSON.parse(localStorage.getItem('ownership_data'))
    const b = JSON.parse(
      localStorage.getItem('previous_data_if_available_shareholder')
    )
    if (b) {
      if (b.length > 0) {
        this.setState({ shareholders: [...x] })
      }
    }
    const shortid = require('shortid')

    this.setState({ restrict: !this.state.restrict })
    this.getFormData()

    var a = JSON.parse(localStorage.getItem('ownership_detail'))
    console.log('x is', x)

    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    // if (y == 0) {
    //   this.setState({ restrict: true });
    // } else if (y == 1) {
    //   this.setState((prevState) => ({
    //     restrict: prevState.restrict,
    //   }));
    // }

    if (x) {
      if (x.length >= 0) {
        this.setState({ shareholders: [...x] })
      }
      console.log('state at page load', this.state)
      var axios = require('axios')
      const email = JSON.parse(localStorage.getItem('add_user'))
      const companyId = JSON.parse(localStorage.getItem('company_id'))
      var data = JSON.stringify({
        company_email: `${email.companyemail}`,
        company_id: `${companyId}`
      })

      var config = {
        method: 'post',
        url: 'https://hrm.zotto.io/api/loans-get',
        headers: {
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
          localStorage.setItem(
            'ownership_data',
            JSON.stringify(response.data.Applicant)
          )
        })
        .catch(function (error) {
          console.log('error of get', error)
        })
    }

    console.log('state is', this.state.restrict)
  }

  componentDidUpdate(state) {
    console.log('state is', this.state)
    localStorage.setItem('ownership_detail', JSON.stringify(this.state))
  }

  render() {
    return (
      <>
        {this.state.restrict ? (
          <RestrictUser />
        ) : (
          <div className='content-box'>
            <div className='container-fluid h-100'>
              <div className='row justify-content-center align-items-center h-100'>
                <div className='col-sm-12 py-4'>
                  <div className='text-center steping'>
                    <span>Step 3 of 7</span>
                  </div>
                  <div
                    onClick={() => this.props.history.push('/business_details')}
                    className='text-center steping'
                    style={{ marginLeft: '80%', cursor: 'pointer' }}
                  >
                    <span>Back</span>
                  </div>
                  <form
                    onSubmit={this.handleSubmit}
                    style={{ marginTop: '5%' }}
                  >
                    <h4 className='pb-4 fs-2 text-center fw-bold'>
                      Owner / Principal Details (minimum 51% ownership)
                    </h4>
                    {this.state.shareholders.map((shareholder, idx) => (
                      <div className='row justify-content-center g-3' key={idx}>
                        {idx >= 1 && (
                          <div className='col-md-6 col-xl-10 text-end'>
                            <hr className='mt-0' />
                            <button
                              type='button'
                              onClick={this.handleRemoveShareholder(
                                idx,
                                shareholder.id
                              )}
                              className='btn btn-sm btn-danger'
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='text'
                              name='fullname'
                              autoComplete='off'
                              value={shareholder.fullname}
                              onChange={this.handleInputChange(idx)}
                              className='form-control'
                              id='fullname'
                              placeholder='Name of Shareholder *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='fullname'>
                              Name of Shareholder{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.fullnameError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='Number'
                              className='form-control'
                              name='lenght_business_ownership'
                              autoComplete='off'
                              id='lenght_business_ownership'
                              onBlur={this.totalPercentage}
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.lenght_business_ownership}
                              placeholder='Shareholder Percentage *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='lenght_business_ownership'>
                              Shareholder Percentage{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.lenght_business_ownershipError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='add_line1'
                              autoComplete='off'
                              id='add_line1'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.add_line1}
                              placeholder='Shareholder Address Line 1 *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='add_line1'>
                              Address Line 1
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.add_line1Error}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='add_line2'
                              autoComplete='off'
                              id='add_line2'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.add_line2}
                              placeholder='Shareholder Percentage *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='add_line2'>Address Line 2</label>
                            <div className='form-text'>
                              {shareholder.add_line2Error}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='city'
                              autoComplete='off'
                              id='city'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.city}
                              placeholder='*'
                            />
                            <span className='bar'></span>
                            <label htmlFor='city'>
                              City<strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.cityError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='state'
                              autoComplete='off'
                              id='state'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.state}
                              placeholder='*'
                            />
                            <span className='bar'></span>
                            <label htmlFor='city'>
                              State/County
                              <strong className='text-danger'></strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.stateError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='postal_zipcode'
                              autoComplete='off'
                              id='postal_zipcode'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.postal_zipcode}
                              placeholder='*'
                            />
                            <span className='bar'></span>
                            <label htmlFor='postal_zipcode'>
                              Post code / Zip Code
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.postal_zipcodeError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='country'
                              autoComplete='off'
                              id='country'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.country}
                              placeholder='*'
                            />
                            <span className='bar'></span>
                            <label htmlFor='country'>
                              Country<strong className='text-danger'></strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.countryError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='text'
                              className='form-control'
                              name='dob'
                              autoComplete='off'
                              id='dob'
                              value={shareholder.dob}
                              onChange={this.handleInputChange(idx)}
                              placeholder='Passport Number *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='dob'>
                              Date Of Birth (DD/MM/YYYY){' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.dobError}
                            </div>
                          </div>
                        </div>
                        {/* <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='text'
                              className='form-control'
                              name='nationality'
                              id='nationality'
                              autoComplete='off'
                              value={shareholder.nationality}
                              onChange={this.handleInputChange(idx)}
                              placeholder='Nationality *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='nationality'>
                              Nationality{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.nationalityError}
                            </div>
                          </div>
                        </div> */}
                        <div className='col-md-6 col-xl-5'>
                          <div className='mb-3'>
                            <div className='form-floating'>
                              <select
                                defaultValue={'DEFAULT'}
                                className='form-select form-control'
                                name='home'
                                autoComplete='off'
                                value={shareholder.home}
                                // id='type'
                                onChange={this.handleInputChange(idx)}
                                // onChange={handleTypeOfBusiness}
                                aria-label='Floating label select example'
                              >
                                <option value='select'>Select</option>
                                <option value='owner'>Owner</option>
                                <option value='renter' name='retail'>
                                  Renter
                                </option>
                              </select>
                              <span className='highlight'></span>
                              <span className='bar'></span>
                              <label htmlFor='type'>
                                Im a home{' '}
                                <strong className='text-danger'>*</strong>
                              </label>
                              <div className='form-text'>
                                {shareholder.homeError}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='email'
                              className='form-control'
                              autoComplete='off'
                              onChange={this.handleInputChange(idx)}
                              name='email'
                              value={shareholder.email}
                              id='emailid'
                              placeholder='Email'
                            />
                            <span className='bar'></span>
                            <label htmlFor='emailid'>
                              Email <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.emailError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='tel'
                              className='form-control'
                              name='phone'
                              autoComplete='off'
                              id='phone'
                              value={shareholder.phone}
                              onChange={this.handleInputChange(idx)}
                              placeholder='Phone Number'
                            />
                            <span className='bar'></span>
                            <label htmlFor='phone'>
                              Phone Number{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.phoneError}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className='row justify-content-center g-3 mt-2'>
                      {this.state.shareholders.length <= 3 && (
                        <div
                          className='col-md-12 col-xl-10 text-center'
                          id='add-morefields'
                        >
                          <button
                            type='button'
                            data-addfield='addmore'
                            className='btn btn-sm btn-success'
                            onClick={this.handleAddShareholder}
                          >
                            + Add More
                          </button>
                        </div>
                      )}
                      <div className='col-md-12 col-xl-5'>
                        <input
                          type='submit'
                          name='submit'
                          className='btn btn-primary w-100 btn-lg rounded-3'
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
}
export default PrincipalOwner
