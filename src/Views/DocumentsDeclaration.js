import React, { Component } from 'react';
import Service from '../services/service';
import SignatureCanvas from 'react-signature-canvas';
import localforage from 'localforage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createReadStream } from 'fs';
import RestrictUser from './RestrictUser';
toast.configure();

var fileExt = ['pdf', 'doc', 'jpeg', 'jpg', 'png'];
let ShareholderFilesArr = [];
let residentialFilesArr = [];
let registerFilesArr = [];
let bankFilesArr = [];
let signatureFilesArr = [];
class DocumentsDeclaration extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the DOM element
    this.nameEl = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.uploadRegistration = this.uploadRegistration.bind(this);
    this.uploadBankAccount = this.uploadBankAccount.bind(this);
    this.uploadSignature = this.uploadSignature.bind(this);
    this.uploadResidential = this.uploadResidential.bind(this);
    this.uploadShareholder = this.uploadShareholder.bind(this);
    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.removeShareholder = this.removeShareholder.bind(this);
    this.removeResidential = this.removeResidential.bind(this);
    this.removeRegister = this.removeRegister.bind(this);
    this.removeBankFile = this.removeBankFile.bind(this);
    this.removeSignature = this.removeSignature.bind(this);

    const y = JSON.parse(localStorage.getItem('isLoggedIn'));
    this.state = {
      restrict: y == 0 ? true : false,
      shareholderFile: null,
      registrationFile: null,
      bankFile: null,
      signatureFile: null,
      residentialFile: null,
      declaration: false,
      shareholder_name: '',
      signature: '',
      filesShareHolder: '',
      filesResidential: '',

      name: '',
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;

    console.log('complete docs', this.state);

    var id = JSON.parse(localStorage.getItem('kyc_id'));
    var validForm = true;
    if (!this.state.registrationFile) {
      this.setState({ registrationFileError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.signatureFile) {
      this.setState({ signatureFileError: 'This field is required.' });
    }
    if (!this.state.bankFile) {
      this.setState({ bankFileError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.filesShareHolder) {
      this.setState({ shareholderFileError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.filesResidential) {
      this.setState({ residentialFileError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.declaration) {
      this.setState({ declarationError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.shareholder_name) {
      this.setState({ shareholder_nameError: 'This field is required.' });
      validForm = false;
    }
    if (!this.state.shareholder_name) {
      this.setState({ shareholder_nameError: 'This field is required.' });
      validForm = false;
    }

    if (/\d/.test(this.state.shareholder_name)) {
      this.setState({ shareholder_nameError: 'Please enter a valid name.' });
      validForm = false;
    }
    // if (this.sigPad.isEmpty()) {
    //   this.setState({ sigPadError: 'This field is required.' });
    //   validForm = false;
    // }
    if (validForm) {
      //var sign = this.sigPad.getTrimmedCanvas().toDataURL('image/png');

      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ'
      );

      var formdata = new FormData();
      formdata.append(
        'copycompanyreg',
        this.state.registrationFile[0],
        '[PROXY]'
      );
      formdata.append('proofcompanybank', this.state.bankFile[0], '[PROXY]');
      formdata.append(
        'passportshareholder',
        this.state.filesShareHolder[0],
        '[PROXY]'
      );
      formdata.append(
        'addressproofshareholder',
        this.state.filesResidential[0],
        '[PROXY]'
      );
      formdata.append('signature', this.state.signatureFile[0], '[PROXY]');
      formdata.append('name', `${this.state.shareholder_name}`);
      formdata.append('id', `${id}`);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch('http://hrm.zotto.io/api/upload', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          toast.success('Successfully Added', {
            position: 'top-right',
            autoClose: 5000,
          });

          history.push('/kyc_success');
        })
        .catch((error) => {
          toast.error('Something went wrong', {
            position: 'top-right',
            autoClose: 5000,
          });
        });

      // if (this.state.registrationFile) {
      //   for (const key of Object.keys(this.state.registrationFile)) {
      //     data.append('copycompanyreg', this.state.registrationFile[key]);
      //   }
      // }
      // if (this.state.bankFile) {
      //   for (const key of Object.keys(this.state.bankFile)) {
      //     data.append('proofcompanybank', this.state.bankFile[key]);
      //   }
      // }

      // if (this.state.filesShareHolder) {
      //   for (const key of Object.keys(this.state.filesShareHolder)) {
      //     data.append('passportshareholder', this.state.filesShareHolder[key]);
      //   }
      // }

      // if (this.state.filesResidential) {
      //   for (const key of Object.keys(this.state.filesResidential)) {
      //     data.append(
      //       'addressproofshareholder',
      //       this.state.filesResidential[key]
      //     );
      //   }
      // }

      // Service.update(data)
      //   .then((response) => {
      //     if (response.data.status === 500) {
      //       toast.error(response.data.message, {
      //         position: 'top-right',
      //         autoClose: 5000,
      //       });
      //     }
      //     if (response.data.status === 200) {
      //       localStorage.clear();
      //       localforage.clear();
      //       ShareholderFilesArr = [];
      //       residentialFilesArr = [];
      //       registerFilesArr = [];
      //       bankFilesArr = [];
      //       toast.success(response.data.message, {
      //         position: 'top-right',
      //         autoClose: 5000,
      //       });
      //       setTimeout(() => {
      //         localStorage.removeItem('insert_id');
      //         this.props.history.push('/');
      //       }, 5000);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('=====' + error);
      //     this.setState({ error: error.response });
      //     toast.error('Something went wrong !!', {
      //       position: 'top-right',
      //       autoClose: 5000,
      //     });
      //   });
    }
  }

  uploadRegistration(e) {
    var id = JSON.parse(localStorage.getItem('kyc_id'));
    registerFilesArr = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop();
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          registrationFile: '',
          registrationFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.',
        });
        return false;
      } else {
        registerFilesArr.push(files[0]);
      }
    }
    this.setState({ registrationFile: files, registrationFileError: '' });
    console.log('files is', files[0]);

    console.log('document state', this.state.registrationFile);
  }

  removeRegister() {
    registerFilesArr = [];
    this.setState({ registrationFile: '' });
  }

  removeSignature() {
    signatureFilesArr = [];
    this.setState({ signatureFile: '' });
  }

  uploadBankAccount(e) {
    bankFilesArr = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop();
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          bankFile: '',
          bankFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.',
        });
        return false;
      } else {
        bankFilesArr.push(files[0]);
      }
    }
    this.setState({ bankFile: files, bankFileError: '' });
  }

  uploadSignature(e) {
    signatureFilesArr = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop();
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          signatureFile: '',
          signatureFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.',
        });
        return false;
      } else {
        signatureFilesArr.push(files[0]);
      }
    }
    console.log('files in sign', files);
    this.setState({ signatureFile: files, signatureFileError: '' });
  }

  removeBankFile() {
    bankFilesArr = [];
    this.setState({ bankFile: '' });
  }

  uploadShareholder(e) {
    var countlenght = ShareholderFilesArr.length;
    const files = e.target.files;
    if (countlenght < 4 && files.length + countlenght <= 4) {
      if (files.length > 4) {
        this.setState({
          shareholderFile: '',
          shareholderFileError: 'Please upload max 4 files.',
        });
        return false;
      }
      for (let i = 0; i < files.length; i++) {
        let ext = files[i].name.split('.').pop();
        if (!fileExt.includes(ext.toLowerCase())) {
          this.setState({
            shareholderFile: '',
            shareholderFileError:
              'Please upload file in pdf, doc, jpeg, jpg, png format.',
          });
          return false;
        } else {
          ShareholderFilesArr.push(files[i]);
        }
      }
      this.setState({
        shareholderFile: files,
        shareholderFileError: '',
        filesShareHolder: ShareholderFilesArr,
      });
    } else {
      alert('Max 4 files can be uploaded');
    }
  }
  removeShareholder(e, index) {
    ShareholderFilesArr.splice(index, 1);
    this.setState({ filesShareHolder: ShareholderFilesArr });
  }

  uploadResidential(e) {
    var countlenght = residentialFilesArr.length;
    const files = e.target.files;
    if (countlenght < 4 && files.length + countlenght <= 4) {
      if (files.length > 4) {
        document.getElementById('residentialFileView').innerHTML = '';
        this.setState({
          residentialFile: '',
          residentialFileError: 'Please upload max 4 files.',
        });
        return false;
      }
      for (let i = 0; i < files.length; i++) {
        let ext = files[i].name.split('.').pop();
        if (!fileExt.includes(ext.toLowerCase())) {
          this.setState({
            residentialFile: '',
            residentialFileError:
              'Please upload file in pdf, doc, jpeg, jpg, png format.',
          });
          return false;
        } else {
          residentialFilesArr.push(files[i]);
        }
      }
      this.setState({
        residentialFile: files,
        residentialFileError: '',
        filesResidential: residentialFilesArr,
      });
    } else {
      alert('Max 4 files can be uploaded');
    }
  }

  removeResidential(e, index) {
    residentialFilesArr.splice(index, 1);
    this.setState({ filesResidential: residentialFilesArr });
  }

  handleInputChanged(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    this.setState({
      declarationError: '',
      shareholder_nameError: '',
      sigPadError: '',
    });
  }

  sigPad = {};
  clear = () => {
    this.sigPad.clear();
  };

  componentDidMount() {
    ShareholderFilesArr = [];
    residentialFilesArr = [];
    registerFilesArr = [];
    bankFilesArr = [];

    const x = JSON.parse(localStorage.getItem('docs'));
    console.log('x is', x);
    if (x) {
      this.setState({
        shareholderFile: x.shareholderFile,
        registrationFile: x.registrationFile,
        bankFile: x.bankFile,
        residentialFile: x.residentialFile,
        declaration: x.declaration,
        shareholder_name: x.shareholder_name,
        signature: x.signature,
        filesShareHolder: x.filesShareHolder,
        filesResidential: x.filesResidential,
      });
    }
  }

  componentDidUpdate(state) {
    localStorage.setItem('docs', JSON.stringify(state));
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
                    <span>Step 6 of 6</span>
                  </div>
                  <div
                    onClick={() =>
                      this.props.history.push('/ownership_details')
                    }
                    className='text-center steping'
                    style={{ marginLeft: '80%', cursor: 'pointer' }}
                  >
                    <span>Back</span>
                  </div>
                  <h4 className='pb-4 fs-2 text-center fw-bold'>
                    Documents and Declaration
                  </h4>
                  <form onSubmit={this.handleSubmit}>
                    <div className='row justify-content-center g-3'>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Copy of Company Registration{' '}
                          <strong className='text-danger'>*</strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='registrationFile'
                            id='file1'
                            onChange={this.uploadRegistration}
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.registrationFileError}
                        </div>
                        {this.state.registrationFile
                          ? registerFilesArr.map((register, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span onClick={this.removeRegister}>
                                    &times;
                                  </span>
                                  {register.name}
                                </div>
                              </div>
                            ))
                          : ''}
                      </div>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Proof Of Company Bank Account{' '}
                          <strong className='text-danger'>*</strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='bankFile'
                            id='file2'
                            onChange={this.uploadBankAccount}
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.bankFileError}
                        </div>
                        <div className='text-muted small fst-italic lh-sm'>
                          It should contain Name, address, account number, IBAN,
                          Swift code. If it is a a screenshot of the account
                          from computer, the web address must be visible. The
                          account balance visibility is not necessary.
                        </div>
                        {this.state.bankFile
                          ? bankFilesArr.map((bankfile, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span onClick={this.removeBankFile}>
                                    &times;
                                  </span>
                                  {bankfile.name}
                                </div>
                              </div>
                            ))
                          : ''}
                      </div>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Passport Copy of Shareholder
                          <strong className='text-danger'>*</strong>
                          <strong
                            className='float-end bg-light px-2 d-inline-block text-muted rounded-pill fs-12px'
                            title='In this field, it should be possible to upload max 4 files'
                          >
                            i
                          </strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='shareholderFile'
                            id='uploadShareholder'
                            onChange={this.uploadShareholder}
                            multiple
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File(s)</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.shareholderFileError}
                        </div>
                        <div className='text-muted small fst-italic'>
                          Copy of all the shareholders who own more than 25%.
                        </div>
                        {this.state.shareholderFile
                          ? ShareholderFilesArr.map((sharefiles, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span
                                    onClick={(e) =>
                                      this.removeShareholder(e, i)
                                    }
                                  >
                                    &times;
                                  </span>
                                  {sharefiles.name}
                                </div>
                              </div>
                            ))
                          : ''}
                      </div>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Residential Address Proof of Shareholders.
                          <strong className='text-danger'>*</strong>
                          <strong
                            className='float-end bg-light px-2 d-inline-block text-muted rounded-pill fs-12px'
                            title='In this field, it should be possible to upload max 4 files'
                          >
                            i
                          </strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='residentialFile'
                            id='residentialFile'
                            onChange={this.uploadResidential}
                            multiple
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File(s)</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.residentialFileError}
                        </div>
                        <div className='text-muted small fst-italic'>
                          The document should not be older than 3 months. Copy
                          of all the Shareholders who own more than 25%.
                        </div>
                        {this.state.residentialFile
                          ? residentialFilesArr.map((resifiles, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span
                                    onClick={(e) =>
                                      this.removeResidential(e, i)
                                    }
                                  >
                                    &times;
                                  </span>
                                  {resifiles.name}
                                </div>
                              </div>
                            ))
                          : ''}
                      </div>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Signature
                          <strong className='text-danger'>*</strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='sinatureFile'
                            id='file3'
                            onChange={this.uploadSignature}
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.signatureFileError}
                        </div>

                        {this.state.signatureFile
                          ? signatureFilesArr.map((signaturefile, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span onClick={this.removeSignature}>
                                    &times;
                                  </span>
                                  {signaturefile.name}
                                </div>
                              </div>
                            ))
                          : ''}

                        {/* <p className='mb-1 field-text'>
                      Signature <strong className='text-danger'>*</strong>
                    </p>
                    <div className='position-relative'>
                      <div className='signature-container'>
                        <SignatureCanvas
                          penColor='black'
                          canvasProps={{ className: 'sigPad' }}
                          ref={(ref) => {
                            this.sigPad = ref;
                          }}
                          onBegin={this.handleInputChanged}
                        />
                        <button
                          type='button'
                          className='btn btn-sm btn-link text-decoration-none'
                          id='signature_clearButton'
                          onClick={this.clear}
                        >
                          Clear
                        </button>
                      </div>
                      <div className='form-text'>{this.state.sigPadError}</div>
                    </div> */}
                      </div>
                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Declaration <strong className='text-danger'>*</strong>
                        </p>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            name='declaration'
                            type='checkbox'
                            id='defaultCheck1'
                            value={this.state.declaration}
                            onChange={this.handleInputChanged}
                          />
                          <label
                            className='form-check-label small'
                            htmlFor='defaultCheck1'
                          >
                            The undersigned hereby accepts this binding 24
                            months contract and agreement and is aware & agrees
                            with ZOTTO LTD.
                          </label>
                          <div className='form-text'>
                            {this.state.declarationError}
                          </div>
                        </div>
                        <div className='form-floating mt-3 mt-md-4'>
                          <input
                            type='text'
                            name='shareholder_name'
                            autoComplete='off'
                            className='form-control'
                            id='namefield'
                            placeholder='Name *'
                            maxLength='12'
                            onChange={this.handleInputChanged}
                          />
                          <label htmlFor='namefield'>
                            Name <strong className='text-danger'>*</strong>
                          </label>
                          <span className='bar'></span>
                          <div className='form-text'>
                            {this.state.shareholder_nameError}
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-md-6 col-xl-5"></div> */}
                      <div className='col-md-12 col-xl-5'>
                        <input
                          type='submit'
                          name='submit'
                          className='btn btn-primary w-100 btn-lg show-opt'
                          value='Submit'
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
export default DocumentsDeclaration;
