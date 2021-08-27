import './includes/bootstrap.min.css';
import './includes/style.css';
import logo from './includes/logo.png';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';
import Routes from './Routes';

function App() {
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
  );
}

export default withRouter(App);

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
