const connection = require('./../config');
const fs = require('fs');

module.exports.test = function (req, res) {
    res.json({
        status: 200,
        message: 'node js running'
    });
};

/*======= Add KYC form data ===========*/
module.exports.add = function (req, res) {
  
  var today = new Date();
  req.body.created_at = today;

  connection.query('SELECT * FROM `kyc` WHERE email = ?', [req.body.email], function (error, results, fields) {
    if (error) {
      res.json({
        status: 500,
        error: error,
        message: 'Something went wrong.'
      });
    }else{
      /*if (results.length > 0) {
        res.json({
          status: 500,
          message: `Email id ${req.body.email} already exist.`
        });
      } else {*/ 

        connection.query('INSERT INTO `kyc` SET ?', [req.body, req.params], function (error, results, fields) {
          if (error) {
            res.json({
              status: 500,
              error: error,
              message: 'Something went wrong.'
            });
          } else {
            res.json({
              status: 200,
              data: results,
              message: 'Record added sucessfully'
            });
          }
        });
      //}
    }
  }); 
};

/*======= Update KYC form data ===========*/
module.exports.update = function (req, res) {
  try {
    var today = new Date();
    if (!req.body.id || req.body.id <= 0) {
      res.json({
        status: 500,
        message: 'Something went wrong.'
      });
    }

    connection.query('SELECT * FROM `kyc` WHERE id = ?', [req.body.id], function (error, results, fields) {

      if (error) {

        res.json({ status: 500, message: 'invalid form id' });

      } else {
        
        
        if (results.length > 0) {
          
          if (req.files && req.files.copy_company_registration) {
            var files = req.files.copy_company_registration;
            var filesname = '';
            for (let i = 0; i < files.length; i++) {
            var random = Math.random().toString(36).substring(7) + Date.now();
            var file = files[i];
            var filename = random+file.name;
              file.mv('public/uploads/docs/' + filename, function (err) {
                if (err) {
                  res.json({ status: 500, message: err });
                }
              });
              var comma = (filesname)? ',':'';
              filesname = filesname + comma + filename;
            }
            req.body.copy_company_registration = filesname;
          }

          if (req.files && req.files.proof_company_bank) {
            var files = req.files.proof_company_bank;
            var filesname = '';
            for (let i = 0; i < files.length; i++) {
            var random = Math.random().toString(36).substring(7) + Date.now();
            var file = files[i];
            var filename = random+file.name;
              file.mv('public/uploads/docs/' + filename, function (err) {
                if (err) {
                  res.json({ status: 500, message: err });
                }
              });
              var comma = (filesname)? ',':'';
              filesname = filesname + comma + filename;
            }
            req.body.proof_company_bank = filesname;
          }

          if (req.files && req.files.passport_share_holder) {
            var files = req.files.passport_share_holder;
            var filesname = '';
            for (let i = 0; i < files.length; i++) {
            var random = Math.random().toString(36).substring(7) + Date.now();
            var file = files[i];
            var filename = random+file.name;
              file.mv('public/uploads/docs/' + filename, function (err) {
                if (err) {
                  res.json({ status: 500, message: err });
                }
              });
              var comma = (filesname)? ',':'';
              filesname = filesname + comma + filename;
            }
            req.body.passport_share_holder = filesname;
          }
          
          if (req.files && req.files.address_proof_share_holder) {
            var files = req.files.address_proof_share_holder;
            var filesname = '';
            for (let i = 0; i < files.length; i++) {
            var random = Math.random().toString(36).substring(7) + Date.now();
            var file = files[i];
            var filename = random+file.name;
              file.mv('public/uploads/docs/' + filename, function (err) {
                if (err) {
                  res.json({ status: 500, message: err });
                }
              });
              var comma = (filesname)? ',':'';
              filesname = filesname + comma + filename;
            }
            req.body.address_proof_share_holder = filesname;
          }

          if(req.body.signature){
            let random = Math.random().toString(36).substring(7) + Date.now();
            let base64String = req.body.signature;
            let base64Image = base64String.split(';base64,').pop();
            let image_name = random+'-signature';
          
            fs.writeFile('public/uploads/signature/'+image_name+'.png', base64Image, {encoding: 'base64'}, function(err) {
                // console.log('File created');
            });
            req.body.signature = image_name+'.png';
          }
          shareholder_data = [];
          if (req.body.shareholders) {
            shareholder_data = req.body.shareholders;
            delete req.body.shareholders;
          }

          connection.query('UPDATE `kyc` SET ? WHERE id = ' + req.body.id, [req.body, req.params], function (error, results, fields) {
            if (error) {
              res.json({
                status: 500,
                error: error,
                message: 'Something went wrong.'
              });
            } else {
              if (shareholder_data.length > 0) {
                
                var sdata = [];
                var i = 0;
                for (var key in shareholder_data) {
                      sdata.push([req.body.id,shareholder_data[i].nameofshareholder, shareholder_data[i].shareholderpercentage, shareholder_data[i].address1,shareholder_data[i].address2, shareholder_data[i].city, shareholder_data[i].zipcode,shareholder_data[i].country, shareholder_data[i].passportnumber, shareholder_data[i].nationality, shareholder_data[i].authorised_signatory,shareholder_data[i].beneficial_owner,shareholder_data[i].director, shareholder_data[i].emailid, shareholder_data[i].phonenumber,today]);
                    i++;
                }

                var shareholder_sql = "INSERT INTO `shareholders` (kyc_id, name, percentage, address1, address2, city, zipcode, country, passport_number, nationality, authorised_signatory, beneficial_owner, director, email, phone,created_at) VALUES ?";

                connection.query(shareholder_sql, [sdata], function (error, results, fields) {

                  if (error) {
                  
                    res.json({
                      status: 500,
                      error: error,
                      message: 'Kyc record added successfully but share holder record are not added'
                    });

                  } else {

                    res.json({
                      status: 200,
                      data: results,
                      message: 'Record updated sucessfully'
                    });

                  }
                });

              } else { 

                res.json({
                  status: 200,
                  data: results,
                  message: 'Record updated sucessfully.'
                });

              }
            }
          });
        }
        else {
          res.json({
            status: 500,
            message: "Something went wrong."
          });
        }
      }
    });
  }catch(err) {
      res.json({ status: 404, error: err });
  }
};
