// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/data');
            // console.log(response.data)
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => {
        clearInterval(interval); 
        };
    }, []);
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
          <h2 className="mb-5  text-slate-900  font-bold">Your Database...🛠️📰</h2>
          <MDBTable>
            <MDBTableHead className="font-bold text-slate-900" style={{color:"#102C57"}}>
                <tr>
                <th>UNIQUE_ID</th>
                <th>CAMERA_ID</th>
                <th>TIMESTAMP</th>
                <th>CURRENT_CAMERA</th>
                <th>EXIT_STATUS</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {data.map((item) => (
                <tr key={item._id}>
                    <td>{item.UNIQUE_ID}</td>
                    <td>{item.CAMERA_ID.join(', ')}</td>
                    <td>{item.TIMESTAMP.join(', ')}</td>
                    <td>{item.CURRENT_CAMERA}</td>
                    <td>{item.EXIT_STATUS ? 'True' : 'False'}</td>
                </tr>
                ))}
            </MDBTableBody>
        </MDBTable>
        </div>
      </main>

    </div>
  </div>
  );
};

export default AdminDashboard;
