import React, { Component } from 'react';
import Service from '../services/service';
import { CountryDropdown } from 'react-country-region-selector';
import localforage from "localforage";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

let countryCode = ''; let company = '';
class BusinessDetails extends Component {
    constructor(props) {
        super(props);
        // create a ref to store the DOM element
        this.state = { 
            companynumber:'',dateofincorporation:'',
            address1: '', city: '', post_code: '',vatnumber:'',dbalegalname:'',
            dbaaddress:'',websitename:'',country: '',
        } 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChanged = this.handleInputChanged.bind(this);
        this.getCompanyData = this.getCompanyData.bind(this);
        this.setValues = this.setValues.bind(this);
      }
      handleSubmit(e) {
        var validForm= true;
        e.preventDefault();
        if (!this.state.country) {
            this.setState({ countryError: 'This field is required.'});
            validForm=false
        }
        if (!this.state.companynumber) {
            this.setState({ companynumberError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.dateofincorporation) {
            this.setState({ dateofincorporationError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.address1) {
            this.setState({ address1Error: 'This field is required.' });
            validForm = false
        }
        if (!this.state.city) {
            this.setState({ cityError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.post_code) {
            this.setState({ post_codeError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.vatnumber) {
            this.setState({ vatnumberError: 'This field is required.' });
            validForm = false
        }
          if (/\d/.test(this.state.city)){
            this.setState({ cityError: 'Please enter a valid value.' });
            validForm = false
        }
        if (/\d/.test(this.state.dbacity)) {
            this.setState({ dbacityError: 'Please enter a valid value.' });
            validForm = false
        }
        const PostDetails = {
            id: localStorage.getItem('insert_id'),
            country_Incorporation: this.state.country,
            company_number: this.state.companynumber,
            company_name: this.state.company_name,
            incorporation_date: this.state.dateofincorporation,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            post_code: this.state.post_code,
            vat_number: this.state.vatnumber,
            dba: this.state.dbalegalname,
            dbaaddress1: this.state.dbaaddress1,
            dbaaddress2: this.state.dbaaddress2,
            dbacity: this.state.dbacity,
            dbapost_code: this.state.dbapost_code,
            website: this.state.websitename,
        };
        if (validForm){
            Service.update(PostDetails).then(response => {
                if(response.data.status === 200){
                    this.props.history.push('/business_activities');
                    localStorage.setItem('countryOfIncorporation', this.state.country);
                    localStorage.setItem('company_number', this.state.companynumber);
                    countryCode = ''; company ='';

                    localforage.setItem('bus_data', this.state);
                }
                if (response.data.status === 500) {
                    let messageObj = response.data.message;
                    messageObj.map((message) => toast.error(message))
                }
            }).catch(error => {
                this.setState({error: error.response}); 
                toast.error('Something went wrong !!', {
                    position: "top-right", autoClose: 5000,
                })
            });
        }
      }

      
      handleInputChanged(event) {
        this.setState({
            [event.target.name] : event.target.value 
        });
        
        this.setState({
            companynumberError: '', dbacityError:'',
            dateofincorporationError   :'',
            address1Error  :'',vatnumberError :'',
            cityError:'',post_codeError : ''
        });
      }

      getCompanyData(event){
        if (event.target.name === 'companynumber') {
            company = event.target.value
            this.getFormData();
        }
      }

        getFormData(){
            if (company && countryCode === 'DK'){
                Service.getData(countryCode, company).then(response => {
                    localforage.removeItem('dk_comp_owners');
                    localforage.setItem('dk_comp_owners', response.data.owners);
                    if(!response.data.error){

                        this.setState({ 
                            dateofincorporation: response.data.startdate ? response.data.startdate:'',
                            address1 : response.data.address ? response.data.address:'',
                            city : response.data.city ? response.data.city:'',
                            post_code: response.data.zipcode ? response.data.zipcode:'',
                            vatnumber: response.data.vat ? response.data.vat:'',
                            company_name:response.data.name ? response.data.name:''
                        });
                    }else{
                        this.setState({
                            dateofincorporation: '',address1: '',
                            city: '',post_code: '',vatnumber: '',company_name: ''
                        });
                    }
                }).catch(error => {
                    this.setState({
                        dateofincorporation: '', address1: '',
                        city: '', post_code: '', vatnumber: '', company_name: ''
                    });
                });
            }
            if (company && countryCode === 'GB') {
                localforage.removeItem('dk_comp_owners');
                Service.getData(countryCode, company).then(response => {
                    if (!response.data.DATA.errors) {
                        let addr_1 = response.data.DATA.registered_office_address.address_line_1 || '';
                        let addr_2 = response.data.DATA.registered_office_address.address_line_2 || '';
                        let postcode = response.data.DATA.registered_office_address.postal_code || '';
                        let city = response.data.DATA.registered_office_address.locality || '';

                        this.setState({
                            dateofincorporation: response.data.DATA.date_of_creation ? response.data.DATA.date_of_creation : '',
                            address1: addr_1,
                            address2: addr_2,
                            city: city,
                            post_code: postcode,
                            vatnumber: response.data.DATA.company_number ? response.data.DATA.company_number : '',
                            company_name: response.data.DATA.company_name ? response.data.DATA.company_name : ''
                        });
                    }else{
                        this.setState({
                            dateofincorporation: '', address1: '',
                            address2: '', post_code: '', vatnumber: '', company_name: ''
                        });
                    }
                }).catch(error => {
                    this.setState({
                        dateofincorporation: '', address1: '',
                        address2: '', post_code: '', vatnumber: '', company_name: ''
                    });
                });
            }
        }

      selectCountry (val) {
        this.setState({ country: val,countryError:''});
        countryCode = val;
        this.getFormData();
      }

    setValues(e){
        let self = this;
        localforage.getItem('bus_data').then(function (value) {
            countryCode = value.country
            self.setState({
                companynumber: value.companynumber,
                country: value.country,
                company_name:value.company_name,
                dateofincorporation:value.dateofincorporation,
                address1:value.address1,
                address2:value.address2,
                city:value.city,
                post_code:value.post_code,
                vatnumber:value.vatnumber,
                dbalegalname:value.dbalegalname,
                dbaaddress1:value.dbaaddress1,
                dbaaddress2:value.dbaaddress2,
                dbacity:value.dbacity,
                dbapost_code:value.dbapost_code,
                websitename:value.websitename
            })
        }).catch(function (err) {
            console.log(err);
        });
    }

    componentDidMount() {
        this.setValues(); 
              
    }
      
    render () {
        const { country } = this.state;
        return (
            <div className="content-box">
            <div className="container-fluid h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-sm-12 py-4">
                        <div className="text-center steping">
                            <span>Step 2 of 6</span>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                        <h4 className="pb-4 fs-2 text-center fw-bold">Business Details</h4>
                        <div className="row justify-content-center g-3">
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                    <CountryDropdown className="form-select form-control"
                                        value={country}
                                        valueType="short"
                                        onChange={(val) => this.selectCountry(val)}
                                    />
                                    <div className="form-text">{this.state.countryError}</div>
                                    <span className="bar"></span>
                                    <label htmlFor="countryofincorporation">Country of Incorporation <strong className="text-danger">*</strong></label>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                    <input type="text" className="form-control" name="companynumber" id="companynumber" onChange={this.handleInputChanged} onBlur={this.getCompanyData} placeholder="Company Name" autoComplete="off" value={this.state.companynumber}/>
                                    <span className="bar"></span>
                                    <label htmlFor="companynumber">Company Number<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.companynumberError}</div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="company_name" id="company_name" onChange={this.handleInputChanged} placeholder="Company Name" autoComplete="off" value={this.state.company_name} />
                                    <span className="bar"></span>
                                    <label htmlFor="company_name">Company Name<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.company_nameError}</div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="vatnumber" id="vatnumber" onChange={this.handleInputChanged} placeholder="VAT Number" autoComplete="off" value={this.state.vatnumber}/>
                                    <span className="bar"></span>
                                    <label htmlFor="vatnumber">VAT Number <strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.vatnumberError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dateofincorporation" id="dateofincorporation" onChange={this.handleInputChanged} placeholder="date" autoComplete="off" value={this.state.dateofincorporation}/>
                                    <span className="bar"></span>
                                            <label htmlFor="dateofincorporation">Date of Incorporation (MM/DD/YY)<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.dateofincorporationError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating overflow-hidden">
                                            <input type="text" className="form-control" name="address1" id="address1" onChange={this.handleInputChanged} placeholder="Legal Address" autoComplete="off" value={this.state.address1}/>
                                    <span className="bar"></span>
                                    <label htmlFor="address1">Address Line 1 <strong className="text-danger">*</strong></label>
                                            <div className="form-text">{this.state.address1Error}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating overflow-hidden">
                                    <input type="text" className="form-control" name="address2" id="address2" onChange={this.handleInputChanged} placeholder="Legal Address" value={this.state.address2} />
                                    <span className="bar"></span>
                                    <label htmlFor="address2">Address Line 2</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating overflow-hidden">
                                            <input type="text" className="form-control" name="city" id="city" autoComplete="off" onChange={this.handleInputChanged} placeholder="Legal Address" value={this.state.city} />
                                    <span className="bar"></span>
                                    <label htmlFor="city">City<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.cityError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating overflow-hidden">
                                            <input type="text" className="form-control" name="post_code" autoComplete="off" id="post_code" onChange={this.handleInputChanged} placeholder="Legal Address" value={this.state.post_code} />
                                    <span className="bar"></span>
                                    <label htmlFor="post_code">Post code <strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.post_codeError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dbalegalname" id="dbalegalname" autoComplete="off" onChange={this.handleInputChanged} value={this.state.dbalegalname} placeholder="DBA (Doing Business As. If different from Legal Name)"/>
                                    <span className="bar"></span>
                                    <label htmlFor="dbalegalname">DBA (Doing Business As. If different from Legal Name)</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dbaaddress1" id="dbaaddress1" autoComplete="off" onChange={this.handleInputChanged} value={this.state.dbaaddress1} placeholder="DBA Address"/>
                                    <span className="bar"></span>
                                    <label htmlFor="dbaaddress1">DBA Address Line 1</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dbaaddress2" id="dbaaddress2" autoComplete="off" onChange={this.handleInputChanged} value={this.state.dbaaddress2} placeholder="DBA Address" />
                                    <span className="bar"></span>
                                    <label htmlFor="dbaaddress2">DBA Address Line 2</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dbacity" id="dbacity" autoComplete="off" onChange={this.handleInputChanged} value={this.state.dbacity} placeholder="DBA City" />
                                    <span className="bar"></span>
                                    <label htmlFor="dbacity">DBA City</label>
                                            <div className="form-text">{this.state.dbacityError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" name="dbapost_code" id="dbapost_code" autoComplete="off" onChange={this.handleInputChanged} value={this.state.dbapost_code} placeholder="DBA Address" />
                                    <span className="bar"></span>
                                    <label htmlFor="dbapost_code">DBA Post code</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="url" className="form-control" name="websitename" id="websitename" autoComplete="off" onChange={this.handleInputChanged} value={this.state.websitename} placeholder="Website https://"/>
                                    <span className="bar"></span>
                                    <label htmlFor="websitename">Website</label>
                                </div>
                            </div>
                            <div className="col-md-12 col-xl-5"></div>
                            <div className="col-md-12 col-xl-5">
                                <input type="submit" name="submit" className="btn btn-primary w-100 btn-lg" value="Next Step" />
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default BusinessDetails;