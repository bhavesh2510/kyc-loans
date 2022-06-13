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

const MerchantQuestionnaire = () => {
  const history = useHistory()
  let countryCode = ''
  let company = ''
  let country = ''

  const [error, setError] = useState({})
  //   const { country } = state;

  const x = JSON.parse(localStorage.getItem('previous_data'))

  const [state, setState] = useState({
    ans1: '',
    ans2: '',
    ans3: '',
    ans4: '',
    ans5: '',
    ans6: '',
    ans7: '',
    ans8: ''
  })

  useEffect(() => {
    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    console.log('y is', y)
    console.log('y is', restrict)
    y == 0 ? setrestrict(true) : setrestrict(false)
    if (x) {
      country = x.country_Incorporation
      setState({
        ...state,
        ans1: x.ans1,
        ans2: x.ans2,
        ans3: x.ans3,
        ans4: x.ans4,
        ans5: x.ans5,
        ans6: x.ans6,
        ans7: x.ans7,
        ans8: x.ans8
      })
    }
  }, [])

  useEffect(() => {
    console.log('state in bd', state)
  }, [state])

  const handleSubmit = (e) => {
    e.preventDefault()
    var validForm = true
    console.log('check', state.country)

    if (!state.ans1 || state.ans1 == '.') {
      setError({
        ...error,
        ans1_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.ans2 || state.ans2 == '.') {
      setError({
        ...error,
        ans2_error: 'This field is required.'
      })
      validForm = false
    }

    if (!state.ans3 || state.ans3 == '.') {
      setError({
        ...error,
        ans3_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.ans4 || state.ans4 == '.') {
      setError({ ...error, ans4_error: 'This field is required.' })
      validForm = false
    }
    if (!state.ans5 || state.ans5 == '.') {
      setError({ ...error, ans5_error: 'This field is required.' })
      validForm = false
    }
    if (!state.ans6 || state.ans6 == '.') {
      setError({
        ...error,
        ans6_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.ans7 || state.ans7 == '.') {
      setError({
        ...error,
        ans7_error: 'This field is required.'
      })
      validForm = false
    }
    if (!state.ans8 || state.ans8 == '.') {
      setError({
        ...error,
        ans8_error: 'This field is required.'
      })
      validForm = false
    }

    if (validForm) {
      var axios = require('axios')

      var data = {
        id: `${x.id}`,
        ans1: `${state.ans1}`,
        ans2: `${state.ans2}`,
        ans3: `${state.ans3}`,
        ans4: `${state.ans4}`,
        ans5: `${state.ans5}`,
        ans6: `${state.ans6}`,
        ans7: `${state.ans7}`,
        ans8: `${state.ans8}`,
        status: 'incomplete'
      }

      var config = {
        method: 'put',
        url: 'https://hrm.zotto.io/api/merchant-questionnaire-update',
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

          history.push('/documents_declaration')
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
      [event.target.name]: event.target.value
    })
    setError({
      ...error,
      ans1_error: '',
      ans2_error: '',
      ans3_error: '',
      ans4_error: '',
      ans5_error: '',
      ans6_error: '',
      ans7_error: '',
      ans8_error: ''
    })
  }

  const [restrict, setrestrict] = useState()

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
                  <span>Step 6 of 7</span>
                </div>
                <div
                  onClick={() => history.push('/processing_information')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '5%' }}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Merchant Questionnaire
                  </h4>
                  <div className='row justify-content-center g-3'>
                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Have you ever been subject to a bankruptcy order? Or
                            your businesses been subject to a winding-up
                            petition, compulsory liquidation, or have ever
                            entered into any voluntary arrangement or compromise
                            agreement with one or more creditors?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              name='ans1'
                              id='ans1'
                              onChange={handleInputChanged}
                              value={state.ans1 == '.' ? '' : state.ans1}
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans1_error}</div>
                        </div>
                      </div>
                      {/* <div
                        className='form-floating'
                        style={{
                          display: 'flex'
                        }}
                      >
                       
                        
                      </div> */}
                    </div>

                    <div
                      className='col-md-6 col-xl-10'
                      style={{ marginTop: '30px' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Are there any existing, pending, threatened or
                            recently filed claims and judgments (including CCJs)
                            against the business, merchants or guarantors? If
                            yes, please give details.
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              name='ans2'
                              id='ans2'
                              onChange={handleInputChanged}
                              value={state.ans2 == '.' ? '' : state.ans2}
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans2_error}</div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Are you up-to-date with your rent or mortgage
                            payments for your business? If not, please explain
                            your current status.
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              name='ans3'
                              id='ans3'
                              onChange={handleInputChanged}
                              value={state.ans3 == '.' ? '' : state.ans3}
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans3_error}</div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Which days of the week are you open?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              name='ans4'
                              id='ans4'
                              onChange={handleInputChanged}
                              value={state.ans4 == '.' ? '' : state.ans4}
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans4_error}</div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Is the business seasonal?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div className='form-floating'>
                            <select
                              defaultValue={'DEFAULT'}
                              className='form-select form-control'
                              name='ans5'
                              autoComplete='off'
                              value={state.ans5}
                              id='type'
                              onChange={handleInputChanged}
                              // onChange={handleTypeOfBusiness}
                              aria-label='Floating label select example'
                            >
                              <option value='Y/N'>Select Yes/No</option>
                              <option value='no'>No</option>
                              <option value='yes' name='retail'>
                                Yes
                              </option>
                            </select>
                            <span className='highlight'></span>
                            <span className='bar'></span>
                            <label htmlFor='type'>Select yes/no</label>
                            <div className='form-text'>{error.ans5_error}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Do you usually close the business for part of the
                            year?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div className='form-floating'>
                            <select
                              defaultValue={'DEFAULT'}
                              className='form-select form-control'
                              name='ans6'
                              autoComplete='off'
                              value={state.ans6}
                              id='type'
                              onChange={handleInputChanged}
                              // onChange={handleTypeOfBusiness}
                              aria-label='Floating label select example'
                            >
                              <option value='Y/N'>Select Yes/No</option>
                              <option value='no'>No</option>
                              <option value='yes' name='retail'>
                                Yes
                              </option>
                            </select>
                            <span className='highlight'></span>
                            <span className='bar'></span>
                            <label htmlFor='type'>Select yes/no</label>
                            <div className='form-text'>{error.ans6_error}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Are there any plans to close the business,
                            temporarily or otherwise, during the next 12 months
                            (for example, for a refurbishment/refitting)?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              onChange={handleInputChanged}
                              name='ans7'
                              id='ans7'
                              value={state.ans7 == '.' ? '' : state.ans7}
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans7_error}</div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-10'>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly'
                        }}
                      >
                        <div
                          style={{
                            width: '50%'
                          }}
                        >
                          <div
                            className='form-text'
                            style={{ color: 'black', fontSize: '14px' }}
                          >
                            Do you have a cash advance outstanding? If so, what
                            is the current balance?
                          </div>
                        </div>
                        <div
                          style={{
                            width: '30%'
                          }}
                        >
                          <div style={{ width: '100%' }}>
                            <textarea
                              onChange={handleInputChanged}
                              value={state.ans8 == '.' ? '' : state.ans8}
                              name='ans8'
                              id='ans8'
                              class='md-textarea form-control'
                              rows='3'
                            ></textarea>
                            <span className='bar'></span>
                          </div>

                          <div className='form-text'>{error.ans8_error}</div>
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

export default MerchantQuestionnaire

//chrome.exe --disable-web-security --user-data-dir="c:/ChromeDevSession
