import React, { Component, useEffect, useState } from 'react';
import Service from '../services/service';
import localforage from 'localforage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router';
import RestrictUser from './RestrictUser';
toast.configure();

const BankDetails = () => {
  // create a ref to store the DOM element

  const x = JSON.parse(localStorage.getItem('previous_data'));

  const history = useHistory();

  const [state, setState] = useState({
    account_name: '',
    bank_name: '',
    reg_nr: '',
    account_number: '',
    sort_code: '',
    iban_number: '',
    swift_bic: '',
  });

  // handleSubmit = this.handleSubmit.bind(this);
  // this.handleInputChanged = this.handleInputChanged.bind(this);

  const handleSubmit = (e) => {
    const y = JSON.parse(localStorage.getItem('kyc_id'));
    e.preventDefault();
    var validForm = true;
    if (!state.account_name) {
      setState({ ...state, account_nameError: 'This field is required.' });
      validForm = false;
    }
    if (/\d/.test(state.account_name)) {
      setState({ ...state, account_nameError: 'Please enter a valid value.' });
      validForm = false;
    }
    if (!state.bank_name) {
      setState({ ...state, bank_nameError: 'This field is required.' });
      validForm = false;
    }
    if (/\d/.test(state.bank_name)) {
      setState({ ...state, bank_nameError: 'Please enter a valid value.' });
      validForm = false;
    }
    if (localStorage.getItem('countryOfIncorporation') === 'DK') {
      if (!state.reg_nr) {
        setState({ ...state, reg_nrError: 'This field is required.' });
        validForm = false;
      }
    }
    if (localStorage.getItem('countryOfIncorporation') != 'DK') {
      if (!state.sort_code) {
        setState({ ...state, sort_codeError: 'This field is required.' });
        validForm = false;
      }
    }
    if (!state.account_number || isNaN(state.account_number)) {
      setState({
        ...state,
        account_numberError: 'Please enter a valid value.',
      });
      validForm = false;
    }
    const PostDetails = {
      id: localStorage.getItem('insert_id'),
      account_name: state.account_name,
      bank_name: state.bank_name,
      reg_nr: state.reg_nr,
      account_number: state.account_number,
      sort_code: state.sort_code,
      iban_number: state.iban_number,
      swift_bic: state.swift_bic,
    };

    if (validForm) {
      var axios = require('axios');
      const no_of_charge = state.number_of_chargeback
        ? state.number_of_chargeback
        : 0;
      var data = {
        id: `${x.id}`,
        account_name: `${state.account_name}`,
        bank_name: `${state.bank_name}`,
        reg_nr: `${state.reg_nr}`,
        account_number: `${state.account_number}`,
        sort_code: `${state.sort_code}`,
        iban_number: `${state.iban_number}`,
        swift_bic: `${state.swift_bic}`,
        status: 'incomplete',
      };

      var config = {
        method: 'put',
        url: 'http://hrm.zotto.io/api/bankdetails',
        mode: 'no-cors',
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log('response of update', response);
          toast.success('Records added successfully', {
            position: 'top-right',
            autoClose: 1000,
          });

          history.push(`/ownership_details`);
        })
        .catch(function (error) {
          setState({ ...state, error: error });
          toast.error('Something went wrong !!', {
            position: 'top-right',
            autoClose: 5000,
          });
        });

      // Service.update(PostDetails).then(response => {
      //     if(response.data.status === 200){
      //         localforage.setItem('bank_data', state);
      //         props.history.push('/ownership_details');
      //     }
      //     if (response.data.status === 500) {
      //         let messageObj = response.data.message;
      //         messageObj.map((message) => toast.error(message))
      //     }
      // }).catch(error => {
      //     setState({error: error.response});
      //     toast.error('Something went wrong !!', {
      //         position: "top-right", autoClose: 5000,
      //     })
      // });
    }

    var axios = require('axios');
    const email = JSON.parse(localStorage.getItem('add_user'));

    var data = {
      email: `${email.companyemail}`,
    };

    var config = {
      method: 'post',
      url: 'http://hrm.zotto.io/api/get',
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log('response of get', response.data);

        localStorage.setItem(
          'previous_data',
          JSON.stringify(response.data.Kyc)
        );
        localStorage.setItem(
          'previous_data_shareholder',
          JSON.stringify(response.data.Shareholders)
        );
      })
      .catch(function (error) {
        console.log('error of get', error);
      });
  };

  const verifyIBAN = (event) => {
    var iban_no = event.target.value;
    if (iban_no === '') {
      return false;
    }
    Service.validateIBAN(iban_no).then((responce) => {
      if (responce.status === 200) {
        var element = document.getElementById('iban_number');
        element.classList.remove('is-valid');
        element.classList.remove('is-invalid');
        if (responce.data.valid) {
          element.classList.add('is-valid');
        } else {
          element.classList.add('is-invalid');
        }
      }
    });
  };

  const handleInputChanged = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
      account_nameError: '',
      bank_nameError: '',
      reg_nrError: '',
      account_numberError: '',
      sort_codeError: '',
    });
  };

  const setValues = (e) => {
    // let self = this;
    localforage
      .getItem('bank_data')
      .then(function (value) {
        console.log(value);
        setState({
          ...state,
          account_name: value.account_name,
          bank_name: value.bank_name,
          reg_nr: value.reg_nr,
          account_number: value.account_number,
          sort_code: value.sort_code,
          iban_number: value.iban_number,
          swift_bic: value.swift_bic,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const [restrict, setrestrict] = useState();
  useEffect(() => {
    setValues();
    // const x = JSON.parse(localStorage.getItem('bank_details'));
    console.log('x is', x);
    const y = JSON.parse(localStorage.getItem('isLoggedIn'));
    console.log('y is', y);
    console.log('y is', restrict);

    if (y == 0) {
      setrestrict(true);
    } else if (y == 1) {
      setrestrict(false);
    }
    if (x) {
      setState({
        ...state,
        account_name: x.account_name,
        bank_name: x.bank_name,
        reg_nr: x.reg_nr,
        account_number: x.account_number,
        sort_code: x.sort_code,
        iban_number: x.iban_number,
        swift_bic: x.swift_bic,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bank_details', JSON.stringify(state));
  }, [state]);

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
                  onClick={() => history.push('/business_activities')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>
                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Bank Details
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
                          value={state.account_name}
                          onChange={handleInputChanged}
                          placeholder='Account Name'
                        />
                        <span className='bar'></span>
                        <label htmlFor='account_name'>
                          Account Name<strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.account_nameError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='bank_name'
                          name='bank_name'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.bank_name}
                          placeholder='Bank Name'
                        />
                        <span className='bar'></span>
                        <label htmlFor='bank_name'>
                          Bank Name<strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.bank_nameError}</div>
                      </div>
                    </div>
                    {localStorage.getItem('countryOfIncorporation') === 'DK' ? (
                      <div className='col-md-6 col-xl-5'>
                        <div className='form-floating'>
                          <input
                            type='text'
                            className='form-control'
                            id='reg_nr'
                            name='reg_nr'
                            autoComplete='off'
                            value={state.reg_nr}
                            onChange={handleInputChanged}
                            placeholder='Registration Nr'
                          />
                          <span className='bar'></span>
                          <label htmlFor='reg_nr'>
                            Reg. Nr. <strong className='text-danger'>*</strong>
                          </label>
                          <div className='form-text'>{state.reg_nrError}</div>
                        </div>
                      </div>
                    ) : (
                      <div className='col-md-6 col-xl-5'>
                        <div className='form-floating'>
                          <input
                            type='text'
                            className='form-control'
                            id='sort_code'
                            autoComplete='off'
                            name='sort_code'
                            value={state.sort_code}
                            onChange={handleInputChanged}
                            placeholder='Sort Code'
                          />
                          <span className='bar'></span>
                          <label htmlFor='sort_code'>
                            Sort Code<strong className='text-danger'>*</strong>
                          </label>
                          <div className='form-text'>
                            {state.sort_codeError}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='account_number'
                          name='account_number'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.account_number}
                          placeholder='Account Number'
                        />
                        <span className='bar'></span>
                        <label htmlFor='account_number'>
                          Account Number
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.account_numberError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='iban_number'
                          name='iban_number'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.iban_number == 'null' ? '' : state.iban_number
                          }
                          onBlur={verifyIBAN}
                          placeholder='IBAN Number'
                        />
                        <span className='bar'></span>
                        <label htmlFor='iban_number'>IBAN Number</label>
                        <div id='iban_check'></div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          id='swift_bic'
                          name='swift_bic'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={
                            state.swift_bic == 'null' ? '' : state.swift_bic
                          }
                          placeholder='SWIFT/BIC'
                        />
                        <span className='bar'></span>
                        <label htmlFor='swift_bic'>SWIFT/BIC</label>
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
  );
};
export default BankDetails;
