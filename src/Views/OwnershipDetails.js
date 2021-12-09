import React, { Component } from 'react';
import Service from '../services/service';
import localforage from 'localforage';
import { toast } from 'react-toastify';
import RestrictUser from './RestrictUser';
import ShortUniqueId from 'short-unique-id';

class OwnershipDetails extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the DOM element
    const y = JSON.parse(localStorage.getItem('isLoggedIn'));
    const shortid = require('shortid');

    this.state = {
      id: localStorage.getItem('insert_id'),
      restrict: y == 0 ? false : true,
      shareholders: [
        {
          name: '',
          nameofshareholderError: '',
          percentage: '',
          address1: '',
          address2: '',
          city: '',
          zipcode: '',
          country: '',
          passport_number: '',
          nationality: '',
          email: '',
          phone: '',
          authorised_signatory: false,
          beneficial_owner: false,
          director: false,
          unique_id: shortid.generate(),
        },
      ],
    };
  }

  handleInputChange = (idx) => (evt) => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        [evt.target.name]: evt.target.value,
        [evt.target.name + 'Error']: '',
      };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleCheckBoxChange = (idx) => (evt) => {
    const roles = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.checked };
    });
    this.setState({ shareholders: roles });
  };

  handleSubmit = (evt) => {
    const { history } = this.props;
    const x = JSON.parse(localStorage.getItem('previous_data'));
    evt.preventDefault();
    const kycId = JSON.parse(localStorage.getItem('kyc_id'));
    var invalidForm = false;
    const errors = this.state.shareholders.map(function (shareholder, idx) {
      if (!shareholder.name || /\d/.test(shareholder.name)) {
        invalidForm = true;
        return {
          ...shareholder,
          nameofshareholderError: 'Please enter a valid value.',
        };
      }
      if (!shareholder.percentage) {
        invalidForm = true;
        return {
          ...shareholder,
          shareholderpercentageError: 'This field is required.',
        };
      } else if (shareholder.percentage < 25) {
        invalidForm = true;
        return {
          ...shareholder,
          shareholderpercentageError:
            'Shareholder Percentage must be grater than or equal to 25.',
        };
      }
      if (!shareholder.address1) {
        invalidForm = true;
        return { ...shareholder, address1Error: 'This field is required.' };
      }
      if (!shareholder.city) {
        invalidForm = true;
        return { ...shareholder, cityError: 'This field is required.' };
      }
      if (!shareholder.zipcode) {
        invalidForm = true;
        return { ...shareholder, zipcodeError: 'This field is required.' };
      }
      if (!shareholder.country) {
        invalidForm = true;
        return { ...shareholder, countryError: 'This field is required.' };
      }
      if (!shareholder.passport_number) {
        invalidForm = true;
        return {
          ...shareholder,
          passportnumberError: 'This field is required.',
        };
      }
      if (!shareholder.nationality) {
        invalidForm = true;
        return { ...shareholder, nationalityError: 'This field is required.' };
      }
      if (!shareholder.email) {
        invalidForm = true;
        return { ...shareholder, emailidError: 'This field is required.' };
      }
      if (
        !shareholder.phone ||
        !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm.test(
          shareholder.phone
        )
      ) {
        invalidForm = true;
        return {
          ...shareholder,
          phonenumberError: 'Please enter a valid value.',
        };
      }
      return shareholder;
    });

    if (invalidForm) {
      this.setState({ shareholders: errors });
      return false;
    }
    var total_share = 0;
    this.state.shareholders.map(function (shareholder, idx) {
      if (shareholder.rpercentage !== '') {
        total_share = total_share + parseInt(shareholder.percentage);
      }
      return true;
    });
    if (total_share !== 100) {
      toast.error(
        'Shareholder information missing, the percentage should be 100.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      return false;
    }

    const shareholders = this.state;
    const shortid = require('shortid');

    console.log('data of share', shareholders);
    const y = JSON.parse(localStorage.getItem('add_user'));

    const arrayData = [];

    console.log('kyc id is', kycId);
    const id = JSON.parse(localStorage.getItem('kyc_id'));
    // console.log('x is', y);
    const finalId = id == null ? x.id : id;

    this.state.shareholders.map((currentvalue) => {
      arrayData.push({
        kyc_id: `${finalId}`,

        name: `${currentvalue.name}`,
        percentage: `${currentvalue.percentage}`,
        address1: `${currentvalue.address1}`,
        address2: `${currentvalue.address2}`,
        city: `${currentvalue.city}`,
        zipcode: `${currentvalue.zipcode}`,
        country: `${currentvalue.country}`,
        passport_number: `${currentvalue.passport_number}`,
        nationality: `${currentvalue.nationality}`,
        authorised_signatory: `${currentvalue.authorised_signatory}`,
        beneficial_owner: `${currentvalue.beneficial_owner}`,
        director: `${currentvalue.director}`,

        email: `${currentvalue.email}`,
        phone: `${currentvalue.phone}`,
        unique_id: `${
          currentvalue.unique_id ? currentvalue.unique_id : shortid.generate()
        }`,
      });
    });

    console.log('array data', arrayData);

    var axios = require('axios');

    var config = {
      method: 'post',
      url: 'http://hrm.zotto.io/api/shareholdersadd',
      mode: 'no-cors',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      data: arrayData,
    };

    axios(config)
      .then(function (response) {
        console.log('response of add', response);
        toast.success('Successfully Registered', {
          position: 'top-right',
          autoClose: 5000,
        });
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
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
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

        history.push('/documents_declaration');
      })
      .catch(function (error) {
        console.log('in error', error);
        //setState({ error: error });
        toast.error('Something went wrong !!');
      });

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
  };

  totalPercentage = () => {
    var total_share = 0;
    this.state.shareholders.map(function (shareholder, idx) {
      if (shareholder.percentage !== '') {
        total_share = total_share + parseInt(shareholder.percentage);
      }
      return true;
    });
    var x = document.getElementById('add-morefields');
    if (x) {
      if (total_share > 99) {
        x.style.display = 'none';
      } else {
        x.style.display = 'block';
      }
    }
  };

  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          name: '',
          nameofshareholderError: '',
          percentage: '',
          address1: '',
          address2: '',
          city: '',
          zipcode: '',
          country: '',
          passport_number: '',
          nationality: '',
          email: '',
          phone: '',
          authorised_signatory: false,
          beneficial_owner: false,
          director: false,
        },
      ]),
    });
  };

  handleRemoveShareholder = (idx) => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx),
    });
  };

  async getFormData() {
    var stateData = [];
    try {
      stateData = await localforage.getItem('owner_data');
    } catch (err) {
      console.log(err);
    }

    var countryOfIncorporation = localStorage.getItem('countryOfIncorporation');

    let shareholderper = '';
    let email = '';
    let pass_number = '';
    let phone_number = '';
    let ben_owner = '';
    let dir = '';
    let auth_signatory = '';
    let addr_1 = '';
    let addr_2 = '';
    let country = '';
    let postcode = '';
    let city = '';
    let nationality = '';

    if (countryOfIncorporation == 'GB') {
      var companyNumber = localStorage.getItem('company_number');
      Service.getShareHolder(companyNumber)
        .then((response) => {
          if (!response.data.error) {
            if (response.data.DATA.items.length > 0) {
              for (let i = 0; i < response.data.DATA.items.length; i++) {
                addr_1 = response.data.DATA.items[i].address.address_line_1;
                addr_2 = response.data.DATA.items[i].address.address_line_2;
                country = response.data.DATA.items[i].address.country;
                postcode = response.data.DATA.items[i].address.postal_code;
                city = response.data.DATA.items[i].address.locality;

                if (stateData && stateData[i]) {
                  shareholderper = stateData[i].shareholderpercentage;
                  email = stateData[i].emailid;
                  pass_number = stateData[i].passportnumber;
                  phone_number = stateData[i].phonenumber;
                  ben_owner = stateData[i].beneficial_owner;
                  dir = stateData[i].director;
                  auth_signatory = stateData[i].authorised_signatory;
                } else {
                  shareholderper = '';
                  email = '';
                  pass_number = '';
                  phone_number = '';
                  ben_owner = '';
                  dir = '';
                  auth_signatory = '';
                }

                if (i === 0) {
                  this.setState({
                    shareholders: [
                      {
                        name: response.data.DATA.items[i].name,
                        nationality: response.data.DATA.items[i].nationality,
                        address1: addr_1,
                        address2: addr_2,
                        city: city,
                        zipcode: postcode,
                        country: country,
                        shareholderpercentage: shareholderper,
                        email: email,
                        passport_number: pass_number,
                        phone: phone_number,
                        beneficial_owner: ben_owner,
                        director: dir,
                        authorised_signatory: auth_signatory,
                      },
                    ],
                  });
                }
                if (i > 0) {
                  this.setState({
                    shareholders: this.state.shareholders.concat([
                      {
                        name: response.data.DATA.items[i].name,
                        nationality: response.data.DATA.items[i].nationality,
                        address1: addr_1,
                        address2: addr_2,
                        city: city,
                        zipcode: postcode,
                        country: country,
                        percentage: shareholderper,
                        email: email,
                        passport_number: pass_number,
                        phone: phone_number,
                        beneficial_owner: ben_owner,
                        director: dir,
                        authorised_signatory: auth_signatory,
                      },
                    ]),
                  });
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (countryOfIncorporation == 'DK') {
      try {
        var dkOwner = await localforage.getItem('dk_comp_owners');

        for (let i = 0; i < dkOwner.length; i++) {
          if (stateData) {
            shareholderper = stateData[i].shareholderpercentage;
            email = stateData[i].emailid;
            pass_number = stateData[i].passportnumber;
            phone_number = stateData[i].phonenumber;
            ben_owner = stateData[i].beneficial_owner;
            dir = stateData[i].director;
            auth_signatory = stateData[i].authorised_signatory;
            nationality = stateData[i].nationality;
            addr_1 = stateData[i].address1;
            addr_2 = stateData[i].address2;
            country = stateData[i].country;
            postcode = stateData[i].zipcode;
            city = stateData[i].city;
          }
          if (i === 0) {
            this.setState({
              shareholders: [
                {
                  name: dkOwner[i].name,
                  nationality: nationality,
                  address1: addr_1,
                  address2: addr_2,
                  city: city,
                  zipcode: postcode,
                  country: country,
                  percentage: shareholderper,
                  email: email,
                  passport_number: pass_number,
                  phone: phone_number,
                  beneficial_owner: ben_owner,
                  director: dir,
                  authorised_signatory: auth_signatory,
                },
              ],
            });
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
                  authorised_signatory: auth_signatory,
                },
              ]),
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleRemoveShareholder = (idx, shareholder_id) => () => {
    var axios = require('axios');
    var data = JSON.stringify({
      email: 'singhbhavesh609@gmail.com',
    });

    var config = {
      method: 'delete',
      url: `http://hrm.zotto.io/api/shareholderdelete/${shareholder_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx),
    });
  };
  x;
  componentDidMount() {
    const x = JSON.parse(localStorage.getItem('previous_data_shareholder'));
    const b = JSON.parse(
      localStorage.getItem('previous_data_if_available_shareholder')
    );
    if (b) {
      if (b.length > 0) {
        this.setState({ shareholders: [...b] });
      }
    }
    const shortid = require('shortid');

    this.setState({ restrict: !this.state.restrict });
    this.getFormData();

    var a = JSON.parse(localStorage.getItem('ownership_detail'));
    console.log('x is', x);

    const y = JSON.parse(localStorage.getItem('isLoggedIn'));
    // if (y == 0) {
    //   this.setState({ restrict: true });
    // } else if (y == 1) {
    //   this.setState((prevState) => ({
    //     restrict: prevState.restrict,
    //   }));
    // }

    if (x) {
      if (x.length > 0) {
        this.setState({ shareholders: [...x] });
      }
      console.log('state at page load', this.state);
      var axios = require('axios');
      const email = JSON.parse(localStorage.getItem('add_user'));

      var data = {
        email: `${email.companyemail}`,
      };

      var config = {
        method: 'post',
        url: 'http://hrm.zotto.io/api/get',
        headers: {
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
    }

    console.log('state is', this.state.restrict);
  }

  componentDidUpdate(state) {
    localStorage.setItem('ownership_detail', JSON.stringify(this.state));
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
                    <span>Step 5 of 6</span>
                  </div>
                  <div
                    onClick={() => this.props.history.push('/bank_details')}
                    className='text-center steping'
                    style={{ marginLeft: '80%', cursor: 'pointer' }}
                  >
                    <span>Back</span>
                  </div>
                  <form onSubmit={this.handleSubmit}>
                    <h4 className='pb-4 fs-2 text-center fw-bold'>
                      Ownership Details- Shareholders
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
                              name='name'
                              autoComplete='off'
                              value={shareholder.name}
                              onChange={this.handleInputChange(idx)}
                              className='form-control'
                              id='nameofshareholder'
                              placeholder='Name of Shareholder *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='nameofshareholder'>
                              Name of Shareholder{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.nameofshareholderError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating'>
                            <input
                              type='Number'
                              className='form-control'
                              name='percentage'
                              autoComplete='off'
                              id='shareholderpercentage'
                              onBlur={this.totalPercentage}
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.percentage}
                              placeholder='Shareholder Percentage *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='shareholderpercentage'>
                              Shareholder Percentage{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.shareholderpercentageError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='address1'
                              autoComplete='off'
                              id='address1'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.address1}
                              placeholder='Shareholder Address Line 1 *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='address1'>
                              Address Line 1
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.address1Error}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='form-floating overflow-hidden'>
                            <input
                              type='text'
                              className='form-control'
                              name='address2'
                              autoComplete='off'
                              id='address2'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.address2}
                              placeholder='Shareholder Percentage *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='address2'>Address Line 2</label>
                            <div className='form-text'>
                              {shareholder.address2Error}
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
                              name='zipcode'
                              autoComplete='off'
                              id='zipcode'
                              onChange={this.handleInputChange(idx)}
                              value={shareholder.zipcode}
                              placeholder='*'
                            />
                            <span className='bar'></span>
                            <label htmlFor='zipcode'>
                              Zip Code<strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.zipcodeError}
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
                              Country<strong className='text-danger'>*</strong>
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
                              name='passport_number'
                              autoComplete='off'
                              id='passportnumber'
                              value={shareholder.passport_number}
                              onChange={this.handleInputChange(idx)}
                              placeholder='Passport Number *'
                            />
                            <span className='bar'></span>
                            <label htmlFor='passportnumber'>
                              Passport Number{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.passportnumberError}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 col-xl-5'>
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
                        </div>
                        <div className='col-md-6 col-xl-5'>
                          <div className='mb-3'>
                            <label
                              htmlFor='areyuo'
                              className='form-label label-text d-block'
                            >
                              Role in the company (Please tick all applicable
                              boxes)
                            </label>
                            <div className='form-check form-check-inline'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={
                                  shareholder.authorised_signatory === 'true'
                                    ? true
                                    : false
                                }
                                onClick={this.handleCheckBoxChange(idx)}
                                name='authorised_signatory'
                                id='authorised_signatory'
                                value='Authorised Signatory'
                              />
                              <label
                                className='form-check-label'
                                htmlFor='authorised_signatory'
                              >
                                Authorised Signatory
                              </label>
                            </div>
                            <div className='form-check form-check-inline'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={
                                  shareholder.beneficial_owner === true
                                    ? true
                                    : false
                                }
                                onClick={this.handleCheckBoxChange(idx)}
                                name='beneficial_owner'
                                id='beneficial_owner'
                                value='Beneficial Owner'
                              />
                              <label
                                className='form-check-label'
                                htmlFor='beneficial_owner'
                              >
                                Beneficial Owner
                              </label>
                            </div>
                            <div className='form-check form-check-inline'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={
                                  shareholder.director === true ? true : false
                                }
                                onClick={this.handleCheckBoxChange(idx)}
                                name='director'
                                id='director'
                                value='Director'
                              />
                              <label
                                className='form-check-label'
                                htmlFor='director'
                              >
                                Director
                              </label>
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
                              {shareholder.emailidError}
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
                              id='phonenumber'
                              value={shareholder.phone}
                              onChange={this.handleInputChange(idx)}
                              placeholder='Phone Number'
                            />
                            <span className='bar'></span>
                            <label htmlFor='phonenumber'>
                              Phone Number{' '}
                              <strong className='text-danger'>*</strong>
                            </label>
                            <div className='form-text'>
                              {shareholder.phonenumberError}
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
    );
  }
}
export default OwnershipDetails;
