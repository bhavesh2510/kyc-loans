import React, { Component } from 'react'
import Service from '../services/service';  
import localforage from "localforage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class BankDetails extends Component {
    constructor(props) {
        super(props);
        // create a ref to store the DOM element
        this.state = { 
            account_name:'',
            bank_name:'',
            reg_nr:'',
            account_number:'',
            sort_code:'',
            iban_number:'',
            swift_bic:'',
        } 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChanged = this.handleInputChanged.bind(this);
      }
    
      handleSubmit(e) {
        e.preventDefault();
        var validForm= true;
        if (!this.state.account_name ) {
            this.setState({ account_nameError: 'This field is required.'});
            validForm=false
        }
        if (/\d/.test(this.state.account_name)) {
            this.setState({ account_nameError: 'Please enter a valid value.' });
            validForm = false
        }
        if (!this.state.bank_name) {
            this.setState({ bank_nameError: 'This field is required.' });
            validForm = false
        }
        if (/\d/.test(this.state.bank_name)) {
            this.setState({ bank_nameError: 'Please enter a valid value.' });
            validForm = false
        }
        if (localStorage.getItem('countryOfIncorporation') === 'DK'){

            if (!this.state.reg_nr) {
                this.setState({ reg_nrError: 'This field is required.' });
                validForm = false
            }
        }
        if (localStorage.getItem('countryOfIncorporation') != 'DK') {

            if (!this.state.sort_code) {
                this.setState({ sort_codeError: 'This field is required.' });
                validForm = false
            }
        }
        if (!this.state.account_number || isNaN(this.state.account_number)) {
            this.setState({ account_numberError: 'Please enter a valid value.' });
            validForm = false
        }
        const PostDetails = {
            id: localStorage.getItem('insert_id'),
            account_name: this.state.account_name,
            bank_name: this.state.bank_name,
            reg_nr: this.state.reg_nr,
            account_number: this.state.account_number,
            sort_code: this.state.sort_code,
            iban_number: this.state.iban_number,
            swift_bic: this.state.swift_bic,
        };

        if(validForm){

            Service.update(PostDetails).then(response => {
                if(response.data.status === 200){
                    localforage.setItem('bank_data', this.state);
                    this.props.history.push('/ownership_details');
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

      verifyIBAN = (event) => {
          var iban_no = event.target.value;
          if(iban_no === ''){
            return false;
          }
          Service.validateIBAN(iban_no).then(responce => {
              if(responce.status === 200){
                var element = document.getElementById("iban_number");
                element.classList.remove("is-valid");
                element.classList.remove("is-invalid");
                  if(responce.data.valid){
                    element.classList.add("is-valid");
                  }else{
                    element.classList.add("is-invalid");
                  }
              }
          })
      }

      handleInputChanged(event) {
        this.setState({
            [event.target.name] : event.target.value 
        });
        this.setState({
            account_nameError : '',
            bank_nameError : '',
            reg_nrError : '',
            account_numberError :'',
            sort_codeError:''
        });
      }

    setValues(e) {
        let self = this;
        localforage.getItem('bank_data').then(function (value) {
            console.log(value)
            self.setState({
                account_name: value.account_name,
                bank_name: value.bank_name,
                reg_nr: value.reg_nr,
                account_number: value.account_number,
                sort_code: value.sort_code,
                iban_number: value.iban_number,
                swift_bic: value.swift_bic,
            })
        }).catch(function (err) {
            console.log(err);
        });
    }

    componentDidMount() {
        this.setValues();
    }
      
    render () {
        return (
            <div className="content-box">
            <div className="container-fluid h-100">
                <div className="row justify-content-center align-items-center" style={{minHeight:'100%'}}>
                    <div className="col-sm-12 py-4">
                    <div className="text-center steping">
                        <span>Step 4 of 6</span>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <h4 className="pb-4 fs-2 text-center fw-bold">Bank Details</h4>
                        <div className="row justify-content-center g-3">
                           <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="account_name" name="account_name" autoComplete="off" value={this.state.account_name} onChange={this.handleInputChanged} placeholder="Account Name"/>
                                    <span className="bar"></span>
                                    <label htmlFor="account_name">Account Name<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.account_nameError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" id="bank_name" name="bank_name" autoComplete="off" onChange={this.handleInputChanged} value={this.state.bank_name} placeholder="Bank Name"/>
                                    <span className="bar"></span>
                                    <label htmlFor="bank_name">Bank Name<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.bank_nameError}</div>
                                </div>
                            </div>
                            {
                                (localStorage.getItem('countryOfIncorporation') === 'DK')?(
                                            <div className="col-md-6 col-xl-5">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="reg_nr" name="reg_nr" autoComplete="off" value={this.state.reg_nr} onChange={this.handleInputChanged} placeholder="Registration Nr" />
                                                    <span className="bar"></span>
                                                    <label htmlFor="reg_nr">Reg. Nr. <strong className="text-danger">*</strong></label>
                                                    <div className="form-text">{this.state.reg_nrError}</div>
                                                </div>
                                            </div> 
                                        ) : (
                                                <div className="col-md-6 col-xl-5">
                                                    <div className="form-floating">
                                                        <input type="text" className="form-control" id="sort_code" autoComplete="off" name="sort_code" value={this.state.sort_code} onChange={this.handleInputChanged} placeholder="Sort Code" />
                                                        <span className="bar"></span>
                                                        <label htmlFor="sort_code">Sort Code<strong className="text-danger">*</strong></label>
                                                        <div className="form-text">{this.state.sort_codeError}</div>
                                                    </div>
                                                </div>
                                        )
                            }
                            
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="number" className="form-control" id="account_number" name="account_number" autoComplete="off" onChange={this.handleInputChanged} value={this.state.account_number} placeholder="Account Number"/>
                                    <span className="bar"></span>
                                            <label htmlFor="account_number">Account Number<strong className="text-danger">*</strong></label>
                                    <div className="form-text">{this.state.account_numberError}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" id="iban_number" name="iban_number" autoComplete="off" onChange={this.handleInputChanged} value={this.state.iban_number} onBlur={this.verifyIBAN} placeholder="IBAN Number"/>
                                    <span className="bar"></span>
                                    <label htmlFor="iban_number">IBAN Number</label><div id='iban_check'></div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-5">
                                <div className="form-floating">
                                            <input type="text" className="form-control" id="swift_bic" name="swift_bic" autoComplete="off" onChange={this.handleInputChanged} value={this.state.swift_bic} placeholder="SWIFT/BIC"/>
                                    <span className="bar"></span>
                                    <label htmlFor="swift_bic">SWIFT/BIC</label>
                                </div>
                            </div>
                            <div className="col-md-12 col-xl-5">
                                <input type="submit" name="submit" className="btn btn-primary w-100 btn-lg show-opt" value="Next Step" />
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
export default BankDetails;