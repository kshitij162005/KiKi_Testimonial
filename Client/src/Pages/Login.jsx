import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../Components/Loader'; 
import Modal from '../Components/Modal'; 
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiZap,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';
import KiKiLogo from "../Images/kiki_logo.png";

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: form.email,
        password: form.password,
      });

      setSuccess(response.data.message);
      setError('');
      localStorage.setItem('userEmailLogin', form.email);
      localStorage.setItem('userId', response.data._id);
      setShowModal(true);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dashboard');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Access your dashboard in seconds with secure authentication."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption keeps your data safe and protected."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Growth Insights",
      description: "Turn customer feedback into actionable business intelligence."
    }
  ];

  return (
    <div className="min-h-screen bg-background-950 flex">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="w-full bg-gradient-to-br from-surface-900/50 to-surface-800/50 backdrop-blur-sm border-r border-surface-800 p-12 flex flex-col justify-center">
          <div className="max-w-md">
            <div className="mb-12">
              <img src={KiKiLogo} alt="KiKi" className="w-16 h-16 rounded-2xl mb-6" />
              <h1 className="text-4xl font-bold text-surface-100 mb-4">
                Welcome back to
                <span className="block gradient-text">KiKi</span>
              </h1>
              <p className="text-lg text-surface-400 leading-relaxed">
                Access your customer feedback dashboard and continue building stronger relationships with your customers.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-primary-400">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-100 mb-2">{feature.title}</h3>
                    <p className="text-surface-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={KiKiLogo} alt="KiKi" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-surface-100">KiKi</h1>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-100 mb-2">Welcome back</h2>
              <p className="text-surface-400">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-error-500/10 border border-error-500/20 text-error-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-success-500/10 border border-success-500/20 text-success-400 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="input pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-500 hover:text-surface-400 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full text-lg py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-surface-400">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Modal */}
      {loading && <Loader />} 
      {showModal && <Modal message="Login successful!" onClose={handleCloseModal} />}
    </div>
  );
};

export default Login;
