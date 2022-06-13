import React, { Component } from 'react'
import Service from '../services/service'
import SignatureCanvas from 'react-signature-canvas'
import localforage from 'localforage'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createReadStream } from 'fs'
import RestrictUser from './RestrictUser'
toast.configure()

var fileExt = ['pdf', 'doc', 'jpeg', 'jpg', 'png']

let bankFilesArr = []
let cardFilesArr = []
let signatureFilesArr = []
let signatureFiles_2Arr = []
class DocumentsDeclaration extends Component {
  constructor(props) {
    super(props)
    // create a ref to store the DOM element
    this.nameEl = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)

    this.uploadBankStatement = this.uploadBankStatement.bind(this)
    this.cardStatementUpload = this.cardStatementUpload.bind(this)
    this.uploadSignature = this.uploadSignature.bind(this)
    this.uploadSignature_2 = this.uploadSignature_2.bind(this)
    this.handleInputChanged = this.handleInputChanged.bind(this)
    this.removeBankFile = this.removeBankFile.bind(this)
    this.removeSignature = this.removeSignature.bind(this)
    this.removeSignature_2 = this.removeSignature_2.bind(this)
    this.removeCard = this.removeCard.bind(this)

    const y = JSON.parse(localStorage.getItem('isLoggedIn'))
    this.state = {
      restrict: y == 0 ? true : false,
      shareholderFile: null,
      registrationFile: null,
      bankFile: null,
      cardFile: null,
      signatureFile: null,
      signatureFile_2: null,
      residentialFile: null,
      declaration: false,
      shareholder_name: '',
      signature: '',
      filesShareHolder: '',
      filesResidential: '',

      name: ''
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { history } = this.props

    console.log('complete docs', this.state)
    const x = JSON.parse(localStorage.getItem('previous_data'))

    var id = JSON.parse(localStorage.getItem('kyc_id'))
    var validForm = true

    if (
      !this.state.shareholder_name ||
      /\d/.test(this.state.shareholder_name)
    ) {
      validForm = false

      this.setState({ shareholder_nameError: 'This field is required.' })
    }
    if (!this.state.bankFile) {
      this.setState({ bankFileError: 'This field is required.' })
      validForm = false
    }
    if (!this.state.cardFile) {
      this.setState({ cardFileError: 'This field is required.' })
      validForm = false
    }
    if (!this.state.signatureFile) {
      this.setState({ signatureFileError: 'This field is required.' })
      validForm = false
    }
    if (!this.state.declaration) {
      this.setState({ declarationError: 'This field is required.' })
      validForm = false
    }

    // if (this.sigPad.isEmpty()) {
    //   this.setState({ sigPadError: 'This field is required.' });
    //   validForm = false;
    // }
    if (validForm) {
      //var sign = this.sigPad.getTrimmedCanvas().toDataURL('image/png');

      var myHeaders = new Headers()
      myHeaders.append(
        'Authorization',
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ'
      )

      var formdata = new FormData()

      formdata.append('proofbankstatement', this.state.bankFile[0])
      formdata.append('proofcardstatement', this.state.cardFile[0])
      formdata.append('applicantsignature', this.state.signatureFile[0])
      formdata.append('name', `${this.state.shareholder_name}`)
      formdata.append('id', `${x.id}`)
      formdata.append('status', 'complete')

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      }

      fetch(
        'https://hrm.zotto.io/api/documents-declaration-upload',
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          toast.success('Successfully Added', {
            position: 'top-right',
            autoClose: 5000
          })

          history.push('/kyc_success')
        })
        .catch((error) => {
          toast.error('Something went wrong', {
            position: 'top-right',
            autoClose: 5000
          })
        })

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

  removeSignature() {
    signatureFilesArr = []
    this.setState({ signatureFile: '' })
  }
  removeSignature_2() {
    signatureFiles_2Arr = []
    this.setState({ signatureFile_2: '' })
  }
  removeCard() {
    cardFilesArr = []
    this.setState({ cardFile: '' })
  }
  uploadBankStatement(e) {
    bankFilesArr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop()
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          bankFile: '',
          bankFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.'
        })
        return false
      } else if (files[0].size >= 8388608) {
        this.setState({
          bankFile: '',
          bankFileError: 'Max upload size is 8 MB..'
        })
        return false
      } else {
        bankFilesArr.push(files[0])
      }
    }
    this.setState({ bankFile: files, bankFileError: '' })
  }

  cardStatementUpload(e) {
    cardFilesArr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop()
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          cardFile: '',
          cardFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.'
        })
        return false
      } else if (files[0].size >= 8388608) {
        this.setState({
          cardFile: '',
          cardFileError: 'Max upload size is 8 MB..'
        })
        return false
      } else {
        cardFilesArr.push(files[0])
      }
    }
    this.setState({ cardFile: files, cardFileError: '' })
  }

  uploadSignature(e) {
    signatureFilesArr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop()
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          signatureFile: '',
          signatureFileError:
            'Please upload file in pdf, doc, jpeg, jpg, png format.'
        })
        return false
      } else if (files[0].size >= 8388608) {
        this.setState({
          signatureFile: '',
          signatureFileError: 'Max upload size is 8 MB..'
        })
        return false
      } else {
        signatureFilesArr.push(files[0])
      }
    }
    console.log('files in sign', files)
    this.setState({ signatureFile: files, signatureFileError: '' })
  }
  uploadSignature_2(e) {
    signatureFiles_2Arr = []
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop()
      if (!fileExt.includes(ext.toLowerCase())) {
        this.setState({
          signatureFile_2: '',
          signatureFile_2Error:
            'Please upload file in pdf, doc, jpeg, jpg, png format.'
        })
        return false
      } else {
        signatureFiles_2Arr.push(files[0])
      }
    }
    console.log('files in sign', files)
    this.setState({ signatureFile_2: files, signatureFile_2Error: '' })
  }

  removeBankFile() {
    bankFilesArr = []
    this.setState({ bankFile: '' })
  }

  handleInputChanged(e) {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })

    this.setState({
      declarationError: '',
      shareholder_nameError: '',
      sigPadError: ''
    })
  }

  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }

  componentDidMount() {
    //   ShareholderFilesArr = []
    //   residentialFilesArr = []
    //   registerFilesArr = []
    //   bankFilesArr = []
    //   const x = JSON.parse(localStorage.getItem('docs'))
    //   console.log('x is', x)
    //   if (x) {
    //     this.setState({
    //       shareholderFile: x.shareholderFile,
    //       registrationFile: x.registrationFile,
    //       bankFile: x.bankFile,
    //       residentialFile: x.residentialFile,
    //       declaration: x.declaration,
    //       shareholder_name: x.shareholder_name,
    //       signature: x.signature,
    //       filesShareHolder: x.filesShareHolder,
    //       filesResidential: x.filesResidential
    //     })
    //   }
  }

  componentDidUpdate(state) {
    console.log('state is', this.state)
    localStorage.setItem('docs', JSON.stringify(state))
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
                <div className='col-sm-12 py-4' style={{ marginTop: '5%' }}>
                  <div className='text-center steping'>
                    <span>Step 7 of 7</span>
                  </div>
                  <div
                    onClick={() =>
                      this.props.history.push('/merchant_question')
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
                          Proof Of Bank Statement{' '}
                          <strong className='text-danger'>*</strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='bankFile'
                            id='file2'
                            onChange={this.uploadBankStatement}
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
                          Minimum 6 months card trading history
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
                          Proof of Card Statement
                          <strong className='text-danger'>*</strong>
                        </p>
                        <label className='drop-input'>
                          <input
                            type='file'
                            name='cardFile'
                            id='file3'
                            onChange={this.cardStatementUpload}
                          />
                          <div className='text-muted small'>
                            Drag & Drop (or){' '}
                            <span className='text-primary'>Choose File</span>
                          </div>
                        </label>
                        <div className='form-text'>
                          {this.state.cardFileError}
                        </div>

                        {this.state.cardFile
                          ? cardFilesArr.map((signaturefile, i) => (
                              <div key={i}>
                                <div className='filesname'>
                                  <span onClick={this.removeCard}>&times;</span>
                                  {signaturefile.name}
                                </div>
                              </div>
                            ))
                          : ''}
                      </div>

                      <div className='col-md-6 col-xl-5'>
                        <p className='mb-1 field-text'>
                          Signature of Applicant
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
                      </div>

                      <div className='col-md-6 col-xl-10'>
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
                            The Applicant(s) certify that all documents and
                            information submitted in connection with this
                            application are true, correct and complete.
                            Furthermore, the Applicant(s) authorise Zotto
                            Limited, its assigns and agents to, obtain trade,
                            landlord, credit, card transaction processing and
                            bank information relating to us, our directors and
                            officers, members and any of the undersigned
                            guarantors, and financial associates and other
                            individuals, from vendors, suppliers, landlords /
                            mortgagees, credit reference agencies, card
                            transaction processors, banks and creditors. This
                            information will be used exclusively for the
                            purposes of (i) considering the entry into of a
                            credit and debit card receivables acquisition
                            agreement with Zotto Limited, and (ii) monitoring
                            our performance during the life of such acquisition
                            agreement, and (iii) collection activities by
                            authorised agents in case of default. The personal
                            information we have collected from you will be
                            shared with fraud prevention agencies who will use
                            it to prevent fraud and money-laundering and to
                            verify your identity. If fraud is detected, you
                            could be refused certain services, funding, or
                            employment.further details of how your information
                            will be used by us and these fraud prevention
                            agencies, and your data protection rights, can be
                            obtained directly from Zotto.Your terms and
                            conditions go here...
                          </label>
                          <div className='form-text'>
                            {this.state.declarationError}
                          </div>
                        </div>
                        <div
                          className='form-floating mt-3 mt-md-4'
                          style={{ width: '50%' }}
                        >
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

                      {/* <div className='col-md-6 col-xl-5'></div> */}
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
    )
  }
}
export default DocumentsDeclaration
