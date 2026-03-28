import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <span className="auth-logo">🌿</span>
          <span className="auth-brand-name">CropScan</span>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
