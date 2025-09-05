import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiPlus, 
  FiTrendingUp, 
  FiMessageSquare, 
  FiVideo, 
  FiZap,
  FiArrowRight,
  FiBarChart2,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiShield
} from 'react-icons/fi';
import happyGif from '../Images/happy.gif';
import palmGif from '../Images/palm.gif';
import angryGif from '../Images/angry.gif';
import cryingGif from '../Images/crying.gif';
import treeImg from '../Images/Tree.svg';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textFeedbackCount, setTextFeedbackCount] = useState(0);
  const [videoFeedbackCount, setVideoFeedbackCount] = useState(0);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await fetch(`http://localhost:3000/getSpacesByUserId/${userId}`);
        
        if (response.status === 404) {
          setSpaces([]);
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const result = await response.json();
          setSpaces(result);

          if (cookieConsent === 'accepted') {
            const spaceNames = result.map(space => space.spacename);
            document.cookie = `spaceNames=${JSON.stringify(spaceNames)}; path=/; max-age=${24 * 60 * 60}`;
          }

          if (result.length > 0) {
            const feedbackCountsResponse = await fetch(`http://localhost:3000/space/${result[0].publicUrl}/feedbackCounts`);
            if (!feedbackCountsResponse.ok) {
              throw new Error(`HTTP error! status: ${feedbackCountsResponse.status}`);
            }
            const feedbackCounts = await feedbackCountsResponse.json();
            setTextFeedbackCount(feedbackCounts.textFeedbackCount);
            setVideoFeedbackCount(feedbackCounts.videoFeedbackCount);
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [cookieConsent]);

  const handleSpaceClick = (space) => {
    sessionStorage.setItem('selectedSpace', JSON.stringify(space));
    navigate('/space-details');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAcceptCookies = () => {
    setCookieConsent('accepted');
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const handleRejectCookies = () => {
    setCookieConsent('rejected');
    localStorage.setItem('cookieConsent', 'rejected');
  };

  useEffect(() => {
    const existingConsent = localStorage.getItem('cookieConsent');
    if (existingConsent) {
      setCookieConsent(existingConsent);
    }
  }, []);

  const totalFeedback = textFeedbackCount + videoFeedbackCount;
  const feedbackGrowth = 12.5; // Mock growth percentage

  return (
    <div className="min-h-screen bg-background-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-surface-800 bg-surface-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">N</span>
              </div>
              <span className="text-xl font-bold text-surface-100">Nova</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-ghost p-2">
                <FiSearch className="w-5 h-5" />
              </button>
              <button className="btn-ghost p-2">
                <FiSettings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleProfileClick}
                className="w-10 h-10 rounded-full bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors flex items-center justify-center"
              >
                <FiUser className="w-5 h-5 text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <header className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-surface-100 mb-4">
                Welcome back to your
                <span className="block gradient-text">feedback dashboard</span>
              </h1>
              <p className="text-lg text-surface-400 max-w-2xl mx-auto">
                Monitor customer insights, track performance, and drive growth with actionable feedback data.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create-space">
                <button className="btn-primary text-lg px-6 py-3">
                  <FiPlus className="mr-2 w-5 h-5" />
                  Create New Space
                </button>
              </Link>
              <button className="btn-ghost text-lg px-6 py-3">
                <FiBarChart2 className="mr-2 w-5 h-5" />
                View Analytics
              </button>
            </div>
          </header>

          {/* Stats Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <FiMessageSquare className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-surface-500">Growth</div>
                    <div className="text-sm font-medium text-success-400">+{feedbackGrowth}%</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-surface-100 mb-1">{totalFeedback}</div>
                <div className="text-sm text-surface-500">Total Feedback</div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                    <FiVideo className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-surface-500">This month</div>
                    <div className="text-sm font-medium text-success-400">+8.2%</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-surface-100 mb-1">{videoFeedbackCount}</div>
                <div className="text-sm text-surface-500">Video Feedback</div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-success-500/20 flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-success-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-surface-500">This month</div>
                    <div className="text-sm font-medium text-success-400">+12.1%</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-surface-100 mb-1">{textFeedbackCount}</div>
                <div className="text-sm text-surface-500">Text Feedback</div>
              </div>
            </div>
          </section>

          {/* Feedback Emotions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-surface-100 mb-6">Customer Sentiment</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { gif: happyGif, label: 'Happy', count: 45, color: 'success' },
                { gif: palmGif, label: 'Satisfied', count: 32, color: 'primary' },
                { gif: angryGif, label: 'Frustrated', count: 18, color: 'warning' },
                { gif: cryingGif, label: 'Disappointed', count: 5, color: 'error' }
              ].map((emotion, index) => (
                <div key={index} className="card p-4 text-center">
                  <img 
                    src={emotion.gif} 
                    alt={emotion.label} 
                    className="w-16 h-16 mx-auto mb-3 rounded-lg"
                  />
                  <div className="text-lg font-semibold text-surface-100 mb-1">{emotion.count}</div>
                  <div className="text-sm text-surface-500">{emotion.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Spaces Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-surface-100">Your Spaces</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-surface-800 text-primary-400' : 'text-surface-500 hover:text-surface-300'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-surface-800 text-primary-400' : 'text-surface-500 hover:text-surface-300'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-surface-400">Loading spaces...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-error-400 mb-4">⚠️</div>
                <p className="text-surface-400">Error: {error}</p>
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                  <img src={treeImg} alt="No spaces" className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-surface-100 mb-2">No spaces yet</h3>
                <p className="text-surface-400 mb-6">Create your first space to start collecting customer feedback</p>
                <Link to="/create-space">
                  <button className="btn-primary">
                    <FiPlus className="mr-2 w-5 h-5" />
                    Create Your First Space
                  </button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {spaces.map((space) => (
                  <div
                    key={space._id}
                    onClick={() => handleSpaceClick(space)}
                    className="card-hover p-6 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                        <FiZap className="w-6 h-6 text-primary-400" />
                      </div>
                      <FiArrowRight className="w-5 h-5 text-surface-500 group-hover:text-primary-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-100 mb-2">{space.spacename}</h3>
                    <p className="text-surface-400 text-sm mb-4">Click to view details and manage feedback</p>
                    <div className="flex items-center text-sm text-surface-500">
                      <FiActivity className="mr-2 w-4 h-4" />
                      Active space
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Cookie Consent */}
      {cookieConsent === null && (
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <div className="card p-6 max-w-md mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <FiShield className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-surface-100 mb-2">Cookie Preferences</h3>
                <p className="text-sm text-surface-400 mb-4">
                  We use cookies to enhance your experience and analyze site usage.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleAcceptCookies}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={handleRejectCookies}
                    className="btn-ghost text-sm px-4 py-2"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;