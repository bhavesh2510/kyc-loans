import React, { Component } from 'react'
import Service from '../services/service';
import localforage from "localforage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class BusinessActivities extends Component {
    constructor(props) {
        super(props);
        // create a ref to store the DOM element
        this.state = { 
            type:'',
            offered_services:'',
            annual_turnover:'',
            card_sales:'',
            avg_transaction:'',
            max_amt_per_trans:'',
            number_of_chargeback:'',
            new_card_process:'',
        } 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChanged = this.handleInputChanged.bind(this);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        var validForm= true;
        if (!this.state.type) {
            this.setState({ typeError: 'This field is required.'});
            validForm=false
        }
        if (!this.state.offered_services) {
            this.setState({ offered_servicesError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.annual_turnover) {
            this.setState({ annual_turnoverError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.card_sales) {
            this.setState({ card_salesError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.avg_transaction) {
            this.setState({ avg_transactionError: 'This field is required.' });
            validForm = false
        }
        if (!this.state.max_amt_per_trans) {
            this.setState({ max_amt_per_transError: 'This field is required.' });
            validForm = false
        }
        // if (!this.state.new_card_process) {
        //     this.setState({ new_card_processError: 'This field is required.' });
        //     validForm = false
        // }
        if (this.state.type !== 'Banking'){
            if (!this.state.new_card_process) {
                this.setState({ new_card_processError: 'This field is required.' });
                validForm = false
            }
        }
        
        const PostDetails = {
            id: localStorage.getItem('insert_id'),
            type: this.state.type,
            offered_services: this.state.offered_services,
            annual_turnover: this.state.annual_turnover,
            card_sales: this.state.card_sales,
            avg_transaction: this.state.avg_transaction,
            max_amt_per_trans: this.state.max_amt_per_trans,
            number_of_chargeback: this.state.number_of_chargeback ? this.state.number_of_chargeback:0,
            new_card_process: this.state.new_card_process,
            previous_acquirer: this.state.previous_acquirer
        };

        if (validForm){

            Service.update(PostDetails).then(response => {
                if(response.data.status === 200){
                    this.props.history.push('/bank_details');
                    localStorage.setItem('bus_type', this.state.type);
                    localforage.setItem('bus_act_data', this.state);
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

        if(event.target.name === 'type' && event.target.value !== "Hospitality"){
            this.setState({
                new_card_process : ''
            });
        }

        this.setState({
            typeError:'',
            offered_servicesError:'',
            annual_turnoverError:'',
            card_salesError:'',
            avg_transactionError:'',
            max_amt_per_transError:'',
            new_card_processError :'',
        });
    }

    setValues(e) {
        let self = this;
        localforage.getItem('bus_act_data').then(function (value) {
            console.log(value)
            self.setState({
                type: value.type,
                offered_services: value.offered_services,
                annual_turnover: value.annual_turnover,
                card_sales: value.card_sales,
                avg_transaction: value.avg_transaction,
                max_amt_per_trans: value.max_amt_per_trans,
                number_of_chargeback: value.number_of_chargeback,
                new_card_process: value.new_card_process,
                previous_acquirer: value.previous_acquirer
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
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-sm-12 py-4">
                        <div className="text-center steping">
                            <span>Step 3 of 6</span>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <h4 className="pb-4 fs-2 text-center fw-bold">Business Activities</h4>
                            <div className="row justify-content-center g-3">
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <select defaultValue={'DEFAULT'} className="form-select form-control" name="type" autoComplete="off" value={this.state.type} id="type" onChange={this.handleInputChanged} aria-label="Floating label select example">
                                            <option value="">Select Type</option>
                                            <option value="Hospitality">Hospitality</option>
                                            <option value="Retail">Retail</option>
                                            <option value="E-commerce">E-commerce</option>
                                            <option value="Banking">Banking</option>
                                        </select>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="type">Type of Business <strong className="text-danger">*</strong></label>
                                        <div className="form-text">{this.state.typeError}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <input className="form-control" placeholder="Leave a comment here" autoComplete="off" name="offered_services" id="offered_services" value={this.state.offered_services} onChange={this.handleInputChanged}/>
                                        <span className="highlight"></span>
                                            <span className="bar"></span>
                                        <label htmlFor="offered_services">Products or Services offered <strong className="text-danger">*</strong></label>
                                        <div className="form-text">{this.state.offered_servicesError}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <input type="number" className="form-control" name="annual_turnover" autoComplete="off" id="annual_turnover" onChange={this.handleInputChanged} value={this.state.annual_turnover} placeholder="Annual Turnover"/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="annual_turnover">Annual Turnover <strong className="text-danger">*</strong></label>
                                        <div className="form-text">{this.state.annual_turnoverError}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <input type="number" className="form-control" id="card_sales" name="card_sales" autoComplete="off" value={this.state.card_sales} placeholder="(Anticipated) Card Sales p.a." onChange={this.handleInputChanged}/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="card_sales">(Anticipated) Card Sales p.a. <strong className="text-danger">*</strong></label>
                                            <div className="form-text">{this.state.card_salesError}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <input type="number" className="form-control" id="avg_transaction" name="avg_transaction" autoComplete="off" placeholder="Phone Number" value={this.state.avg_transaction}onChange={this.handleInputChanged}/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="avg_transaction">Average Transaction Value <strong className="text-danger">*</strong></label>
                                        <div className="form-text">{this.state.avg_transactionError}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5">
                                    <div className="form-floating">
                                            <input type="number" className="form-control" id="max_amt_per_trans" autoComplete="off" name="max_amt_per_trans" onChange={this.handleInputChanged} value={this.state.max_amt_per_trans} placeholder="Phone Number"/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="max_amt_per_trans">Maximum amount per transaction <strong className="text-danger">*</strong></label>
                                        <div className="form-text">{this.state.max_amt_per_transError}</div>
                                    </div>
                                </div>
                                {
                                    (this.state.type === 'E-commerce')?(
                                            <div className="col-md-6 col-xl-5">
                                                <div className="form-floating">
                                                    <input type="number" className="form-control" id="number_of_chargeback" autoComplete="off" name="number_of_chargeback" value={this.state.number_of_chargeback} onChange={this.handleInputChanged} placeholder="No. of chargebacks in last one year" />
                                                    <span className="highlight"></span>
                                                    <span className="bar"></span>
                                                    <label htmlFor="number_of_chargeback">No. of chargebacks in last one year </label>
                                                </div>
                                            </div>
                                    ):''
                                }
                                {
                                        (this.state.type !== 'Banking')?(
                                        <div className="col-md-6 col-xl-5">
                                            <div className="mb-3">
                                                    <label htmlFor="areyuo" className="form-label label-text d-block">Are you new to Card processing? <strong className="text-danger">*</strong></label>
                                                <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" id="inlineRadio1" name="new_card_process" onChange={this.handleInputChanged} checked={this.state.new_card_process === 'Yes'?true:false} value="Yes" />
                                                    <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" id="inlineRadio2" name="new_card_process" onChange={this.handleInputChanged} value="No" checked={this.state.new_card_process === 'No' ? true : false} />
                                                    <label className="form-check-label" htmlFor="inlineRadio2">No</label>
                                                </div>
                                                <div className="form-text">{this.state.new_card_processError}</div>
                                            </div>
                                        </div>
                                        ):''
                                }
                                {
                                        (this.state.new_card_process === 'No') ? (
                                            <div className="col-md-6 col-xl-5">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="previous_acquirer" name="previous_acquirer" onChange={this.handleInputChanged} value={this.state.previous_acquirer} placeholder="Who was your previous acquirer/service provider" />
                                                    <span className="highlight"></span>
                                                    <span className="bar"></span>
                                                    <label htmlFor="previous_acquirer">Who was your previous acquirer/service provider </label>
                                                </div>
                                            </div>
                                        ) : ''
                                }
                                <div className="col-md-6 col-xl-5 mt-0"></div>
                                <div className="w-100"></div>
                                <div className="col-md-12 col-xl-5 mt-0">
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
export default BusinessActivities;