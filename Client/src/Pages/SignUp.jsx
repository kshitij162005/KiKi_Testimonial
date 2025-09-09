import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../Components/Loader";
import Modal from "../Components/Modal";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiCheck,
  FiZap,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.SIGNUP,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNum: form.phoneNumber,
          password: form.password,
        }
      );

      if (response.status === 201) {
        setModalMessage("Sign up successful!");
        setShowModal(true);
        localStorage.setItem("userEmailSignup", form.email);
        localStorage.setItem("userId", response.data._id);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        setTimeout(() => {
          setShowModal(false);
          navigate("/dashboard");
        }, 2000);
      } else {
        setModalMessage("Sign up failed!");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        setModalMessage(`Sign up failed: ${error.response.data.message}`);
      } else {
        setModalMessage("An error occurred. Please try again later.");
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const benefits = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Start Collecting Today",
      description: "Get your first customer feedback within minutes of signing up."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Grow Your Business",
      description: "Turn customer insights into actionable growth strategies."
    }
  ];

  return (
    <div className="min-h-screen bg-background-950 flex">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="w-full bg-gradient-to-br from-surface-900/50 to-surface-800/50 backdrop-blur-sm border-r border-surface-800 p-12 flex flex-col justify-center">
          <div className="max-w-md">
            <div className="mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <h1 className="text-4xl font-bold text-surface-100 mb-4">
                Join thousands of
                <span className="block gradient-text">successful businesses</span>
              </h1>
              <p className="text-lg text-surface-400 leading-relaxed">
                Start collecting customer feedback today and transform your business with actionable insights that drive real growth.
              </p>
            </div>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-primary-400">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-100 mb-2">{benefit.title}</h3>
                    <p className="text-surface-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-surface-800/50 border border-surface-700">
              <div className="flex items-center space-x-3 mb-3">
                <FiCheck className="w-5 h-5 text-success-400" />
                <span className="text-sm font-medium text-surface-200">Free forever plan</span>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <FiCheck className="w-5 h-5 text-success-400" />
                <span className="text-sm font-medium text-surface-200">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiCheck className="w-5 h-5 text-success-400" />
                <span className="text-sm font-medium text-surface-200">Setup in under 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <h1 className="text-2xl font-bold text-surface-100">KiKi</h1>
          </div>

          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-surface-100 mb-2">Create your account</h2>
              <p className="text-surface-400">Start collecting customer feedback today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-surface-500" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-200 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-surface-500" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="john@example.com"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-200 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="Create a strong password"
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

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full text-lg py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-surface-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Modal */}
      {loading && <Loader />}
      {showModal && (
        <Modal message={modalMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SignUp;