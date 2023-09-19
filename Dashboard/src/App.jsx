import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './css/style.css';
import './charts/ChartjsConfig';
import LoginSystem from './pages/LoginSystem';
import Dashboard from './pages/Dashboard';
import RegisterSystem from './pages/RegisterSystem'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
      <Routes>
        <Route exact path="/" element={<LoginSystem />} />
        <Route exact path="/register" element={<RegisterSystem />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/adminlogin" element={<AdminLogin />} />
        <Route exact path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
  );
}

export default App;
