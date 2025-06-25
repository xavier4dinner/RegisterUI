import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './pages/Register/RegisterForm';
import AddressForm from './pages/Register/AddressForm';
import PasswordInput from './components/shared/PasswordInput';
import SuccessMessage from './components/shared/SuccessMessage';
import OTPModal from './components/common/OTPModal';
import LoginPage from './pages/Login/LoginPage';
import Layout from './components/common/Layout';
import LoginForm from './pages/Login/LoginForm';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import "./styles/Register.css";
import "./styles/LoginForm.css";
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;