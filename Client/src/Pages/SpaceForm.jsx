import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api.js';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiStar, 
  FiImage, 
  FiLink, 
  FiCopy, 
  FiCheck,
  FiZap,
  FiSettings,
  FiMessageSquare,
  FiGlobe
} from 'react-icons/fi';

const SpaceForm = () => {
  const [formData, setFormData] = useState({
    spacename: '',
    publicUrl: '',
    headerTitle: '',
    customMessage: '',
    questions: '',
    starRatings: false,
  });

  const [image, setImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCopiedModal, setShowCopiedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User ID is not found in local storage. Please log in again.");
      setLoading(true); 
      return;
    }

    const formattedData = {
      ...formData,
      questions: formData.questions.split(',').map((q) => q.trim()),
      user_Id: userId,
    };
  
    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('spacename', formattedData.spacename);
      formDataObj.append('publicUrl', formattedData.publicUrl);
      formDataObj.append('headerTitle', formattedData.headerTitle);
      formDataObj.append('customMessage', formattedData.customMessage);
      formDataObj.append('questions', JSON.stringify(formattedData.questions));
      formDataObj.append('starRatings', formattedData.starRatings);
      formDataObj.append('user_Id', formattedData.user_Id);
      
      if (image) {
        formDataObj.append('image', image);
      }

      const response = await fetch(API_ENDPOINTS.ADD_SPACE, {
        method: 'POST',
        body: formDataObj,
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const result = await response.json();
          alert(result.message);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const result = await response.json();
        const link = result.link;
        setGeneratedLink(link);
        setShowModal(true);
  
        sessionStorage.setItem('generatedLink', link);
  
        await fetch(API_ENDPOINTS.ADD_LINK(formData.publicUrl), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link }),
        });
  
        setFormData({
          spacename: '',
          publicUrl: '',
          headerTitle: '',
          customMessage: '',
          questions: '',
          starRatings: false,
        });
  
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create space. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setShowModal(false);
      setShowCopiedModal(true);
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Quick Setup",
      description: "Create your feedback space in under 2 minutes"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Customizable",
      description: "Personalize your space with custom branding and messages"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Smart Questions",
      description: "Ask the right questions to get actionable insights"
    }
  ];

  return (
    <div className="min-h-screen bg-background-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-surface-800 bg-surface-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-ghost p-2"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <span className="text-xl font-bold text-surface-100">KiKi</span>
            </div>
            <div className="text-sm text-surface-400">
              Create New Space
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Features */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-surface-100 mb-4">
                    Create your
                    <span className="block gradient-text">feedback space</span>
                  </h1>
                  <p className="text-lg text-surface-400 leading-relaxed">
                    Set up a dedicated space to collect customer feedback, testimonials, and insights that will help grow your business.
                  </p>
                </div>

                <div className="space-y-6">
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

                <div className="mt-8 p-6 rounded-xl bg-surface-800/50 border border-surface-700">
                  <h3 className="text-lg font-semibold text-surface-100 mb-3">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-surface-400">
                    <li className="flex items-center space-x-2">
                      <FiCheck className="w-4 h-4 text-success-400" />
                      <span>Custom feedback form</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiCheck className="w-4 h-4 text-success-400" />
                      <span>Shareable link</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiCheck className="w-4 h-4 text-success-400" />
                      <span>Real-time responses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FiCheck className="w-4 h-4 text-success-400" />
                      <span>Analytics dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-surface-100 mb-2">Space Configuration</h2>
                  <p className="text-surface-400">Configure your feedback space settings and customization options.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-200 mb-2">
                        Space Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSettings className="h-5 w-5 text-surface-500" />
                        </div>
                        <input
                          type="text"
                          name="spacename"
                          value={formData.spacename}
                          onChange={handleChange}
                          placeholder="My Product Feedback"
                          required
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-200 mb-2">
                        Public URL *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLink className="h-5 w-5 text-surface-500" />
                        </div>
                        <input
                          type="text"
                          name="publicUrl"
                          value={formData.publicUrl}
                          onChange={handleChange}
                          placeholder="my-product-feedback"
                          required
                          className="input pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-200 mb-2">
                      Header Title
                    </label>
                    <input
                      type="text"
                      name="headerTitle"
                      value={formData.headerTitle}
                      onChange={handleChange}
                      placeholder="We'd love to hear from you!"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-200 mb-2">
                      Custom Message
                    </label>
                    <textarea
                      name="customMessage"
                      value={formData.customMessage}
                      onChange={handleChange}
                      placeholder="Share your experience with our product and help us improve..."
                      rows={4}
                      className="input resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-200 mb-2">
                      Questions (comma separated)
                    </label>
                    <input
                      type="text"
                      name="questions"
                      value={formData.questions}
                      onChange={handleChange}
                      placeholder="What do you love about our product?, What could we improve?, Would you recommend us?"
                      className="input"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="starRatings"
                      checked={formData.starRatings}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 bg-surface-800 border-surface-700 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <label className="text-sm font-medium text-surface-200">
                      Enable Star Ratings
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-200 mb-2">
                      Upload Image
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiImage className="h-5 w-5 text-surface-500" />
                      </div>
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="input pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer"
                      />
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
                        Creating Space...
                      </div>
                    ) : (
                      <>
                        <FiPlus className="mr-2 w-5 h-5" />
                        Create Space
                      </>
                    )}
                  </button>
                </form>

                {isSubmitted && (
                  <div className="mt-8 p-6 rounded-xl bg-success-500/10 border border-success-500/20 text-center">
                    <p className="text-success-400 mb-4">Redirecting to Dashboard...</p>
                    <Link to="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative card p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-success-400" />
            </div>
            <h2 className="text-2xl font-bold text-surface-100 mb-4">Space Created Successfully!</h2>
            <p className="text-surface-400 mb-6">Your space link has been generated:</p>
            <div className="p-4 rounded-lg bg-surface-800 border border-surface-700 mb-6">
              <p className="text-sm text-primary-400 break-all">{generatedLink}</p>
            </div>
            <button onClick={handleCopyLink} className="btn-primary w-full">
              <FiCopy className="mr-2 w-5 h-5" />
              Copy Link to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Copied Modal */}
      {showCopiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCopiedModal(false)}></div>
          <div className="relative card p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-success-400" />
            </div>
            <h2 className="text-2xl font-bold text-surface-100 mb-4">Link Copied!</h2>
            <p className="text-surface-400 mb-6">Your space link has been copied to the clipboard:</p>
            <div className="p-4 rounded-lg bg-surface-800 border border-surface-700 mb-6">
              <p className="text-sm text-primary-400 break-all">{generatedLink}</p>
            </div>
            <button onClick={() => setShowCopiedModal(false)} className="btn-primary w-full">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceForm;
