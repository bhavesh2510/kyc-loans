import axios from "axios";
import constant from "./const";

const Service = {
    add: (detail) => {
        return axios.post(constant.baseUrl + '/api/kyc/add', detail);
    },
    update: (detail) => {
        return axios.post(constant.baseUrl + '/api/kyc/update', detail);
    },
    emailOTP: (data) => {
        return axios.post('https://pay.cibopay.com/Sendotp/sendotpemail', data);
    },
    phoneOTP: (data) => {
        return axios.post('https://pay.cibopay.com/Sendotp/sendotpmobile', data);
    },
    getIpData:() => {
        return axios.get('https://ipapi.co/json/');
    },
    validateIBAN:(iban_no) => {
        return axios.get('https://openiban.com/validate/'+iban_no);
    },
    getData: (country, value) => {
        if (country === 'DK') {
            return axios.get('http://cvrapi.dk/api?search=' + value + '&country=' + country);
        }
        if (country === 'GB') {
            return axios.get('https://pay.cibopay.com/getData/search/regnumber/'+value);
        }
    },
    getShareHolder: (compnumber) => {
        return axios.get('https://pay.cibopay.com/getData/shareholderInfo/regnumber/' + compnumber);
    },
};

export default Service;