// Login.js
import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard } from 'mdb-react-ui-kit';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

const AdminLogin = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === 'admin' && formData.password === 'admin') {
        window.location.href = '/admindashboard';
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };
  
  return (
    
    <div className="flex h-screen overflow-hidden">
        
    {/* Sidebar */}
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

    {/* Content area */}
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

      {/*  Site header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {/* Welcome banner */}
          <WelcomeBanner />

            <MDBContainer className="mt-5">
            <MDBRow className="justify-content-center">
                <MDBCol md="6">
                <MDBCard className="p-5">
                    <div className="p-4">
                    <form onSubmit={handleSubmit}>
                    <h3 className='mb-5 text-center'>Admin Login</h3>
                        <div className="grey-text">
                        <MDBInput
                            label="Your username"
                            icon="user"
                            group="true"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="mb-3"
                            required
                        />
                        <MDBInput
                            label="Your password"
                            icon="lock"
                            group="true"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mb-3"
                            required
                        />
                        </div>
                        <div className="text-center">
                        <MDBBtn type="submit">Login</MDBBtn>
                        </div>
                    </form>
                    </div>
                </MDBCard>
                </MDBCol>
            </MDBRow>
            </MDBContainer>
        </div>
      </main>

    </div>
  </div>
  );
};

export default AdminLogin;
