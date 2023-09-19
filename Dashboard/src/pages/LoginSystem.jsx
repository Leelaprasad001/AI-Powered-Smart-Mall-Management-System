import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
}
from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

function LoginSystem() {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {

      if (!email || !password ) {
        setErrorMessage('Please fill all the fields !!');
        return;
      }

      if (!emailRegex.test(email)) {
        setErrorMessage('Invalid email format.');
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/get_user/?email=${email}&password=${password}`, {});
      
    if (response.status === 200) {
      window.location.href = '/dashboard'; 
    }

  
    } 
    
    catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    
    <MDBContainer fluid className='background-radial-gradient overflow-hidden' >

      <MDBRow>

        <MDBCol md='7' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            The best offer <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>for your business</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
          In the competitive retail landscape, businesses need insights into customer behavior. Traditional mall management falls short in analyzing customer data. An AI-driven smart mall system utilizes advanced algorithms for efficient operations. The system forecasts business and enhances security, identifying customer types and foot traffic. This aids traders in inventory planning, optimizing supply chains, and avoiding stock issues.
          </p>

        </MDBCol>

        <MDBCol md='5' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>

            <h3 className='mb-5 text-center'>Good to see you again</h3>
              <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>

              <div className="mb-4 text-danger" style={{ height: '20px' }}>{errorMessage}</div>

              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <Link to="/">Forgot password?</Link>
              </div>

            <MDBBtn className='w-100 mb-4' size='md' onClick={handleRegister}>login</MDBBtn>

              <div className="text-center">
              <p className="mb-5 pb-lg-2">
                Don't have an account?  <Link to="/register">Register here</Link>
              </p>
              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  
  );
}

export default LoginSystem;