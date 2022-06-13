import './includes/bootstrap.min.css'
import './includes/style.css'
import zottoLoansLogo from './includes/logo.png'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { withRouter } from 'react-router'
import Routes from './Routes'

function App() {
  const [logo, setlogo] = useState('')
  useEffect(() => {
    var axios = require('axios')
    const queryString = require('query-string')
    const parsed = queryString.parse(window.location.search)
    console.log('parsed is', parsed)
    if (parsed.id) {
      var config = {
        method: 'get',
        url: `https://hrm.zotto.io/api/getcompanies/${parsed.id}`,
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
          'Content-Type': 'application/json'
        }
      }

      axios(config)
        .then(function (response) {
          setlogo(
            `https://hrm.zotto.io/user-uploads/app-logo/${response.data.Compdetails.logo}`
          )
          console.log('response of get logo', response.data)
          localStorage.setItem(
            'company_id',
            JSON.stringify(response.data.Compdetails.id)
          )
        })
        .catch(function (error) {
          console.log('error of get', error)
        })
    } else if (!parsed.id) {
      var config = {
        method: 'get',
        url: `https://hrm.zotto.io/api/getcompanies/1}`,
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJhdWQiOiJodHRwOlwvXC9sb2NhbGhvc3QiLCJpYXQiOjE2MjE1MzYxMTMsIm5iZiI6MTYyMTUzNjExMywiZXhwIjoxNjIxNjIyNTEzLCJwYXlsb2FkIjp7ImlkIjoiMTYyMDU3MzM5OTIxOSJ9fQ.G7cyNtmMsbWsMNC2NvCJSm4X9uGnSM--o4uTMxrvMdQ',
          'Content-Type': 'application/json'
        }
      }

      axios(config)
        .then(function (response) {
          setlogo(
            `https://hrm.zotto.io/user-uploads/app-logo/${response.data.Compdetails.logo}`
          )
          console.log('response of get logo', response.data)
          localStorage.setItem(
            'company_id',
            JSON.stringify(response.data.Compdetails.id)
          )
        })
        .catch(function (error) {
          console.log('error of get', error)
        })

      localStorage.setItem('company_id', JSON.stringify(1))
    }
  }, [])

  return (
    <Router>
      <div className='wrapper'>
        <div className='left-box'>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <img src={logo} className='img-fluid' alt='logo' />
            <p className='copyrights'>
              &copy; 2021 - Zotto - All Rights Reserved.
            </p>
          </div>
        </div>
        <Routes />
      </div>
    </Router>
  )
}

export default withRouter(App)

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'))
}
