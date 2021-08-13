const validator = require('../helpers/validate');
const add = (req, res, next) => {
    const validationRule = {
        "company_name": "required|string",
        "comp_reg_no": "required",
        "country_Incorporation": "required",
        "comp_phone_no": "required|min:10|max:13",
        "email": "required|email",
        "incorporation_date": "required",
        "vat_number": "required",
        "legal_address": "required|string",
        "offered_services": "required|string",
        "annual_turnover": "required|min:1",
        "avg_transaction": "required|min:1",
        "card_sales": "required|min:1",
        "max_amt_per_trans": "required",
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            const messages = [];
            for (const property in err.errors) {
                messages.push(`${err.errors[property]}`);
            }
            res.json({ status: 500, message: messages });
        } else {
            next();
        }
    });
};

const update = (req, res, next) => {
    const validationRule = {
        "id": "required|min:1"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            const messages = [];
            for (const property in err.errors) {
                messages.push(`${err.errors[property]}`);
            }
            res.json({ status: 500, message: messages });
        } else {
            next();
        }
    });
}
module.exports = { 
    add,
    update
}