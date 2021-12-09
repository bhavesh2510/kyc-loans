import React, { Component, useEffect, useState } from 'react';
import Service from '../services/service';
import localforage from 'localforage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import RestrictUser from './RestrictUser';
toast.configure();

const BusinessActivities = () => {
  // create a ref to store the DOM element
  const history = useHistory();
  const x = JSON.parse(localStorage.getItem('previous_data'));

  const [state, setState] = useState({
    type: '',
    offered_services: '',
    annual_turnover: '',
    card_sales: '',
    avg_transaction: '',
    max_amt_per_trans: '',
    number_of_chargeback: '',
    new_card_process: '',
  });

  // handleSubmit = this.handleSubmit.bind(this);
  // this.handleInputChanged = this.handleInputChanged.bind(this);

  useEffect(() => {
    console.log('state in ba', state);
  }, [state]);

  const handleSubmit = (e) => {
    const y = JSON.parse(localStorage.getItem('kyc_id'));
    e.preventDefault();
    var validForm = true;
    if (!state.type) {
      setState({ ...state, typeError: 'This field is required.' });
      validForm = false;
    }
    if (!state.offered_services) {
      setState({ ...state, offered_servicesError: 'This field is required.' });
      validForm = false;
    }
    if (!state.annual_turnover) {
      setState({ ...state, annual_turnoverError: 'This field is required.' });
      validForm = false;
    }
    if (!state.card_sales) {
      setState({ ...state, card_salesError: 'This field is required.' });
      validForm = false;
    }
    if (!state.avg_transaction) {
      setState({ ...state, avg_transactionError: 'This field is required.' });
      validForm = false;
    }
    if (!state.max_amt_per_trans) {
      setState({ ...state, max_amt_per_transError: 'This field is required.' });
      validForm = false;
    }
    // if (!state.new_card_process) {
    //     setState({...state, new_card_processError: 'This field is required.' });
    //     validForm = false
    // }
    if (state.type !== 'Banking') {
      if (!state.new_card_process) {
        setState({
          ...state,
          new_card_processError: 'This field is required.',
        });
        validForm = false;
      }
    }

    console.log('final business state', state);

    const PostDetails = {
      id: localStorage.getItem('insert_id'),
      type: state.type,
      offered_services: state.offered_services,
      annual_turnover: state.annual_turnover,
      card_sales: state.card_sales,
      avg_transaction: state.avg_transaction,
      max_amt_per_trans: state.max_amt_per_trans,
      number_of_chargeback: state.number_of_chargeback
        ? state.number_of_chargeback
        : 0,
      new_card_process: state.new_card_process,
      previous_acquirer: state.previous_acquirer,
    };

    if (validForm) {
      var axios = require('axios');
      const no_of_charge = state.number_of_chargeback
        ? state.number_of_chargeback
        : 0;
      var data = {
        id: `${x.id}`,
        type: `${state.type}`,
        offered_services: `${state.offered_services}`,

        annual_turnover: `${state.annual_turnover}`,
        card_sales: `${state.card_sales}`,
        avg_transaction: `${state.avg_transaction}`,
        max_amt_per_trans: `${state.max_amt_per_trans}`,
        number_of_chargeback: `${no_of_charge}`,
        new_card_process: `${state.new_card_process}`,
        previous_acquirer: `${state.previous_acquirer}`,
        status: 'incomplete',
      };

      var config = {
        method: 'put',
        mode: 'no-cors',
        url: 'http://hrm.zotto.io/api/businessactivities',
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
          console.log('response of update', response);
          toast.success('Records added successfully', {
            position: 'top-right',
            autoClose: 1000,
          });

          history.push(`/bank_details`);
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
      //         this.props.history.push('/bank_details');
      //         localStorage.setItem('bus_type', this.state.type);
      //         localforage.setItem('bus_act_data', this.state);
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

    var axios = require('axios');
    const email = JSON.parse(localStorage.getItem('add_user'));

    var data = {
      email: `${email.companyemail}`,
    };

    var config = {
      method: 'post',
      mode: 'no-cors',
      url: 'http://hrm.zotto.io/api/get',
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

  const [dropdown, setdropdown] = useState();

  const handleTypeOfBusiness = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,

      typeError: '',
      offered_servicesError: '',
      annual_turnoverError: '',
      card_salesError: '',
      avg_transactionError: '',
      max_amt_per_transError: '',
      new_card_processError: '',
    });
  };

  const handleInputChanged = (event) => {
    console.log('name is', event.target.value);
    //setdropdown(event.target.value);
    var x = event.target.value;
    setState({
      ...state,
      [event.target.name]: event.target.value,

      typeError: '',
      offered_servicesError: '',
      annual_turnoverError: '',
      card_salesError: '',
      avg_transactionError: '',
      max_amt_per_transError: '',
      new_card_processError: '',
    });

    if (event.target.name === 'type' && event.target.value !== 'Hospitality') {
      setState({ ...state, new_card_process: '' });
    }
  };

  useEffect(() => {
    console.log('business state', dropdown);
  }, [dropdown]);

  const setValues = (e) => {
    // let self = this;
    localforage
      .getItem('bus_act_data')
      .then(function (value) {
        console.log('value is', value);
        setState({
          ...state,
          type: value.type,
          offered_services: value.offered_services,
          annual_turnover: value.annual_turnover,
          card_sales: value.card_sales,
          avg_transaction: value.avg_transaction,
          max_amt_per_trans: value.max_amt_per_trans,
          number_of_chargeback: value.number_of_chargeback,
          new_card_process: value.new_card_process,
          previous_acquirer: value.previous_acquirer,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const [restrict, setrestrict] = useState();
  useEffect(() => {
    setValues();
    // const x = JSON.parse(localStorage.getItem('business_activities'));
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
        type: x.type,
        offered_services: x.offered_services,
        annual_turnover: x.annual_turnover,
        card_sales: x.card_sales,
        avg_transaction: x.avg_transaction,
        max_amt_per_trans: x.max_amt_per_trans,
        number_of_chargeback: x.number_of_chargeback,
        new_card_process: x.new_card_process,
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('business_activities', JSON.stringify(state));
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
                  <span>Step 3 of 6</span>
                </div>
                <div
                  onClick={() => history.push('/business_details')}
                  className='text-center steping'
                  style={{ marginLeft: '80%', cursor: 'pointer' }}
                >
                  <span>Back</span>
                </div>
                <form onSubmit={handleSubmit}>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Business Activities
                  </h4>
                  <div className='row justify-content-center g-3'>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <select
                          defaultValue={'DEFAULT'}
                          className='form-select form-control'
                          name='type'
                          autoComplete='off'
                          value={state.type}
                          id='type'
                          //onChange={handleInputChanged}
                          onChange={handleTypeOfBusiness}
                          aria-label='Floating label select example'
                        >
                          <option value=''>Select Type</option>
                          <option value='Hospitality'>Hospitality</option>
                          <option value='Retail' name='retail'>
                            Retail
                          </option>
                          <option value='E-commerce'>E-commerce</option>
                          <option value='Banking'>Banking</option>
                        </select>
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='type'>
                          Type of Business{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.typeError}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          className='form-control'
                          placeholder='Leave a comment here'
                          autoComplete='off'
                          name='offered_services'
                          id='offered_services'
                          value={state.offered_services}
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='offered_services'>
                          Products or Services offered{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.offered_servicesError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          name='annual_turnover'
                          autoComplete='off'
                          id='annual_turnover'
                          onChange={handleInputChanged}
                          value={state.annual_turnover}
                          placeholder='Annual Turnover'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='annual_turnover'>
                          Annual Turnover{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.annual_turnoverError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='card_sales'
                          name='card_sales'
                          autoComplete='off'
                          value={state.card_sales}
                          placeholder='(Anticipated) Card Sales p.a.'
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='card_sales'>
                          (Anticipated) Card Sales p.a.{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>{state.card_salesError}</div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='avg_transaction'
                          name='avg_transaction'
                          autoComplete='off'
                          placeholder='Phone Number'
                          value={state.avg_transaction}
                          onChange={handleInputChanged}
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='avg_transaction'>
                          Average Transaction Value{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.avg_transactionError}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-5'>
                      <div className='form-floating'>
                        <input
                          type='number'
                          className='form-control'
                          id='max_amt_per_trans'
                          autoComplete='off'
                          name='max_amt_per_trans'
                          onChange={handleInputChanged}
                          value={state.max_amt_per_trans}
                          placeholder='Phone Number'
                        />
                        <span className='highlight'></span>
                        <span className='bar'></span>
                        <label htmlFor='max_amt_per_trans'>
                          Maximum amount per transaction{' '}
                          <strong className='text-danger'>*</strong>
                        </label>
                        <div className='form-text'>
                          {state.max_amt_per_transError}
                        </div>
                      </div>
                    </div>
                    {state.type === 'E-commerce' ? (
                      <div className='col-md-6 col-xl-5'>
                        <div className='form-floating'>
                          <input
                            type='number'
                            className='form-control'
                            id='number_of_chargeback'
                            autoComplete='off'
                            name='number_of_chargeback'
                            value={state.number_of_chargeback}
                            onChange={handleInputChanged}
                            placeholder='No. of chargebacks in last one year'
                          />
                          <span className='highlight'></span>
                          <span className='bar'></span>
                          <label htmlFor='number_of_chargeback'>
                            No. of chargebacks in last one year{' '}
                          </label>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {state.type !== 'Banking' ? (
                      <div className='col-md-6 col-xl-5'>
                        <div className='mb-3'>
                          <label
                            htmlFor='areyuo'
                            className='form-label label-text d-block'
                          >
                            Are you new to Card processing?{' '}
                            <strong className='text-danger'>*</strong>
                          </label>
                          <div className='form-check form-check-inline'>
                            <input
                              className='form-check-input'
                              type='radio'
                              id='inlineRadio1'
                              name='new_card_process'
                              onChange={handleInputChanged}
                              checked={
                                state.new_card_process === 'Yes' ? true : false
                              }
                              value='Yes'
                            />
                            <label
                              className='form-check-label'
                              htmlFor='inlineRadio1'
                            >
                              Yes
                            </label>
                          </div>
                          <div className='form-check form-check-inline'>
                            <input
                              className='form-check-input'
                              type='radio'
                              id='inlineRadio2'
                              name='new_card_process'
                              onChange={handleInputChanged}
                              value='No'
                              checked={
                                state.new_card_process === 'No' ? true : false
                              }
                            />
                            <label
                              className='form-check-label'
                              htmlFor='inlineRadio2'
                            >
                              No
                            </label>
                          </div>
                          <div className='form-text'>
                            {state.new_card_processError}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {state.new_card_process === 'No' ? (
                      <div className='col-md-6 col-xl-5'>
                        <div className='form-floating'>
                          <input
                            type='text'
                            className='form-control'
                            id='previous_acquirer'
                            name='previous_acquirer'
                            onChange={handleInputChanged}
                            value={state.previous_acquirer}
                            placeholder='Who was your previous acquirer/service provider'
                          />
                          <span className='highlight'></span>
                          <span className='bar'></span>
                          <label htmlFor='previous_acquirer'>
                            Who was your previous acquirer/service provider{' '}
                          </label>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    <div className='col-md-6 col-xl-5 mt-0'></div>
                    <div className='w-100'></div>
                    <div className='col-md-12 col-xl-5 mt-0'>
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
export default BusinessActivities;
