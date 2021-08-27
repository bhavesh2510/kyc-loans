import React, { Component, useEffect, useState } from 'react';
import Service from '../services/service';
import { CountryDropdown } from 'react-country-region-selector';
import localforage from 'localforage';
import { useHistory } from 'react-router';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { stat } from 'fs';
import RestrictUser from './RestrictUser';
toast.configure();

const BusinessDetails = () => {
  const history = useHistory();
  let countryCode = '';
  let company = '';

  const [error, setError] = useState({});
  //   const { country } = state;

  const [state, setState] = useState({
    companynumber: '',
    dateofincorporation: '',
    address1: '',
    city: '',
    post_code: '',
    vatnumber: '',
    dbalegalname: '',
    dbaaddress: '',
    websitename: '',
    country: '',
    company_name: '',
  });

  const {
    companynumber,
    dateofincorporation,
    address1,
    city,
    post_code,
    vatnumber,
    dbalegalname,
    dbaaddress,
    websitename,
    country,
  } = state;

  //   const handleSubmit = handleSubmit.bind(this);
  //   const handleInputChanged = handleInputChanged.bind(this);
  //   const getCompanyData = getCompanyData.bind(this);
  //   const setValues = setValues.bind(this);

  useEffect(() => {
    console.log('updated state is', state);
  }, [state]);

  const handleSubmit = (e) => {
    // const { history } = this.props;

    const y = JSON.parse(localStorage.getItem('kyc_id'));
    console.log('x is', y);

    var validForm = true;
    console.log('check', state.country);
    e.preventDefault();
    if (!state.country) {
      setError({ ...error, countryError: 'This field is required.' });
      validForm = false;
    }
    if (!state.companynumber) {
      setError({ ...error, companynumberError: 'This field is required.' });
      validForm = false;
    }
    if (!state.dateofincorporation) {
      setError({
        ...error,
        dateofincorporationError: 'This field is required.',
      });
      validForm = false;
    }
    if (!state.address1 == true) {
      setError({ ...error, address1Error: 'This field is required.' });
      validForm = false;
    }
    if (!state.city) {
      setError({ ...error, cityError: 'This field is required.' });
      validForm = false;
    }
    if (!state.post_code) {
      setError({ ...error, post_codeError: 'This field is required.' });
      validForm = false;
    }
    if (!state.vatnumber) {
      setError({ ...error, vatnumberError: 'This field is required.' });
      validForm = false;
    }
    if (/\d/.test(state.city)) {
      setError({ ...error, cityError: 'Please enter a valid value.' });
      validForm = false;
    }
    if (/\d/.test(state.dbacity)) {
      setError({ ...error, dbacityError: 'Please enter a valid value.' });
      validForm = false;
    }

    if (validForm) {
      var axios = require('axios');

      var data = {
        id: `${y}`,
        ip: `${state.ip}`,
        location: `${state.location}`,
        country_Incorporation: `${state.country}`,
        company_number: `${state.companynumber}`,
        company_name: `${state.company_name}`,
        incorporation_date: `${state.dateofincorporation}`,
        address1: `${state.address1}`,
        address2: `${state.address2}`,
        city: `${state.city}`,
        post_code: `${state.post_code}`,
        vat_number: `${state.vatnumber}`,
        dba: `${state.dbalegalname}`,
        dbaaddress1: `${state.dbaaddress1}`,
        dbaaddress2: `${state.dbaaddress2}`,
        dbacity: `${state.dbacity}`,
        dbapost_code: `${state.dbapost_code}`,
        website: `${state.websitename}`,
        type: '',
        offered_services: '',
        annual_turnover: '',
        card_sales: '',
        avg_transaction: '',
        max_amt_per_trans: '',
        number_of_chargeback: '',
        new_card_process: '',
        previous_acquirer: '',
        account_name: '',
        bank_name: '',
        reg_nr: '',
        account_number: '',
        iban_number: '',
        swift_bic: '',
        sort_code: '',
        copy_company_registration: '',
        proof_company_bank: '',
        passport_share_holder: '',
        address_proof_share_holder: '',
        signature: '',
        name: '',
        declaration: '',
      };

      var config = {
        method: 'put',
        url: 'http://hrm.zotto.io/api/update',
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
          'Content-Type': 'application/json',
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

          history.push(`/business_activities`);
        })
        .catch(function (error) {
          console.log('response of add', error);

          toast.error('Something went wrong.', {
            position: 'top-right',
            autoClose: 5000,
          });
        });

      // Service.update(PostDetails).then(response => {
      //     if(response.data.status === 200){
      //         this.props.history.push('/business_activities');
      //         localStorage.setItem('countryOfIncorporation', this.state.country);
      //         localStorage.setItem('company_number', this.state.companynumber);
      //         countryCode = ''; company ='';

      //         localforage.setItem('bus_data', this.state);
      //     }
      //     if (response.data.status === 500) {
      //         let messageObj = response.data.message;
      //         messageObj.map((message) => toast.error(message))
      //     }
      // }).catch(error => {
      //     this.setState({error: error.response});
      //     toast.error('Something went wrong !!', {
      //         position: "top-right", autoClose: 5000,
      //     })
      // });
    }
  };

  const handleInputChanged = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
    setError({
      ...error,
      companynumberError: '',
      dbacityError: '',
      dateofincorporationError: '',
      address1Error: '',
      vatnumberError: '',
      cityError: '',
      post_codeError: '',
    });
  };

  const getCompanyData = (event) => {
    if (event.target.name === 'companynumber') {
      company = event.target.value;
      getFormData();
    }
  };

  const getFormData = () => {
    if (company && countryCode === 'DK') {
      Service.getData(countryCode, company)
        .then((response) => {
          localforage.removeItem('dk_comp_owners');
          localforage.setItem('dk_comp_owners', response.data.owners);
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
              company_name: response.data.name ? response.data.name : '',
            });
          } else {
            setState({
              ...state,
              dateofincorporation: '',
              address1: '',
              city: '',
              post_code: '',
              vatnumber: '',
              company_name: '',
            });
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
            company_name: '',
          });
        });
    }
    if (company && countryCode === 'GB') {
      localforage.removeItem('dk_comp_owners');
      Service.getData(countryCode, company)
        .then((response) => {
          if (!response.data.DATA.errors) {
            let addr_1 =
              response.data.DATA.registered_office_address.address_line_1 || '';
            let addr_2 =
              response.data.DATA.registered_office_address.address_line_2 || '';
            let postcode =
              response.data.DATA.registered_office_address.postal_code || '';
            let city =
              response.data.DATA.registered_office_address.locality || '';

            setState({
              ...state,
              dateofincorporation: response.data.DATA.date_of_creation
                ? response.data.DATA.date_of_creation
                : '',
              address1: addr_1,
              address2: addr_2,
              city: city,
              post_code: postcode,
              vatnumber: response.data.DATA.company_number
                ? response.data.DATA.company_number
                : '',
              company_name: response.data.DATA.company_name
                ? response.data.DATA.company_name
                : '',
            });
          } else {
            setState({
              ...state,
              dateofincorporation: '',
              address1: '',
              address2: '',
              post_code: '',
              vatnumber: '',
              company_name: '',
            });
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
            company_name: '',
          });
        });
    }
  };

  const selectCountry = (val) => {
    setState({ ...state, country: val, countryError: '' });
    countryCode = val;
    getFormData();
  };

  const setValues = (e) => {
    // let self = this;
    localforage
      .getItem('bus_data')
      .then(function (value) {
        countryCode = value.country;
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
          websitename: value.websitename,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const [restrict, setrestrict] = useState();
  useEffect(() => {
    setValues();
    const x = JSON.parse(localStorage.getItem('business_detail'));
    const y = JSON.parse(localStorage.getItem('isLoggedIn'));
    console.log('y is', y);
    console.log('y is', restrict);

    if (y == 0) {
      setrestrict(true);
    } else if (y == 1) {
      setrestrict(false);
    }
    console.log('x is', x);
    if (x) {
      setState({
        ...state,
        companynumber: x.companynumber,
        dateofincorporation: x.dateofincorporation,
        address1: x.address1,
        city: x.city,
        post_code: x.post_code,
        vatnumber: x.vatnumber,
        dbalegalname: x.dbalegalname,
        dbaaddress: x.dbaaddress,
        websitename: x.websitename,
        country: x.country,
        company_name: x.company_name,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('business_detail', JSON.stringify(state));
  }, [state]);

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
                  <span>Step 2 of 6</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Business Details
                  </h4>
                  <div className='row justify-content-center g-3'>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <CountryDropdown
                          className='form-select form-control'
                          value={country}
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
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='companynumber'
                          id='companynumber'
                          onChange={handleInputChanged}
                          onBlur={getCompanyData}
                          placeholder='Company Name'
                          autoComplete='off'
                          value={state.companynumber}
                        />
                        <span className='bar'></span>
                        <label htmlFor='companynumber'>
                          Company Number
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.companynumberError}
                        </div>
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
                          value={state.company_name}
                        />
                        <span className='bar'></span>
                        <label htmlFor='company_name'>
                          Company Name<strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.company_nameError}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='vatnumber'
                          id='vatnumber'
                          onChange={handleInputChanged}
                          placeholder='VAT Number'
                          autoComplete='off'
                          value={state.vatnumber}
                        />
                        <span className='bar'></span>
                        <label htmlFor='vatnumber'>
                          VAT Number <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.vatnumberError}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dateofincorporation'
                          id='dateofincorporation'
                          onChange={handleInputChanged}
                          placeholder='date'
                          autoComplete='off'
                          value={state.dateofincorporation}
                        />
                        <span className='bar'></span>
                        <label htmlFor='dateofincorporation'>
                          Date of Incorporation (MM/DD/YY)
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {error.dateofincorporationError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='address1'
                          id='address1'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          autoComplete='off'
                          value={state.address1}
                        />
                        <span className='bar'></span>
                        <label htmlFor='address1'>
                          Address Line 1{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.address1Error}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='address2'
                          id='address2'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          value={state.address2}
                        />
                        <span className='bar'></span>
                        <label htmlFor='address2'>Address Line 2</label>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating overflow-hidden'>
                        <input
                          type='text'
                          className='form-control'
                          name='city'
                          id='city'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          placeholder='Legal Address'
                          value={state.city}
                        />
                        <span className='bar'></span>
                        <label htmlFor='city'>
                          City<strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{error.cityError}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
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
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbalegalname'
                          id='dbalegalname'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbalegalname}
                          placeholder='DBA (Doing Business As. If different from Legal Name)'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbalegalname'>
                          DBA (Doing Business As. If different from Legal Name)
                        </label>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbaaddress1'
                          id='dbaaddress1'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbaaddress1}
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbaaddress1'>DBA Address Line 1</label>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbaaddress2'
                          id='dbaaddress2'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbaaddress2}
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbaaddress2'>DBA Address Line 2</label>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbacity'
                          id='dbacity'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbacity}
                          placeholder='DBA City'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbacity'>DBA City</label>
                        <div className='form-text'>{error.dbacityError}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='text'
                          className='form-control'
                          name='dbapost_code'
                          id='dbapost_code'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.dbapost_code}
                          placeholder='DBA Address'
                        />
                        <span className='bar'></span>
                        <label htmlFor='dbapost_code'>DBA Post code</label>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='url'
                          className='form-control'
                          name='websitename'
                          id='websitename'
                          autoComplete='off'
                          onChange={handleInputChanged}
                          value={state.websitename}
                          placeholder='Website https://'
                        />
                        <span className='bar'></span>
                        <label htmlFor='websitename'>Website</label>
                      </div>
                    </div>
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
  );
};

export default BusinessDetails;

//chrome.exe --disable-web-security --user-data-dir="c:/ChromeDevSession
