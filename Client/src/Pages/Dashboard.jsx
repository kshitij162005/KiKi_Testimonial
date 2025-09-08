import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FiGrid,
  FiList,
  FiShield,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { Button, VideoFeedbackComingSoon } from "../Components/ui";
import SentimentAnalysis from "../Components/dashboard/SentimentAnalysis/SentimentAnalysis";
import AnimatedBackground from "../Components/ui/AnimatedBackground/AnimatedBackground";
import happyGif from "../Images/happy.gif";
import palmGif from "../Images/palm.gif";
import angryGif from "../Images/angry.gif";
import cryingGif from "../Images/crying.gif";
import treeImg from "../Images/Tree.svg";

// Magical Create Button Component
const MagicalCreateButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 2 second magical loading experience
    setTimeout(() => {
      setIsLoading(false);
      navigate("/create-space");
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 text-lg px-8 py-4 h-16 min-w-[280px] transition-all duration-300 ease-out hover:scale-[1.05] hover:shadow-2xl hover:shadow-purple-500/40 active:scale-[0.98] flex items-center justify-center rounded-2xl font-bold tracking-wide disabled:cursor-not-allowed"
      style={{
        background: isLoading
          ? "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"
          : undefined,
        backgroundSize: isLoading ? "400% 400%" : undefined,
        animation: isLoading
          ? "magicalGradient 1.5s ease-in-out infinite"
          : undefined,
      }}
    >
      {/* Magical sparkle overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div
          className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer opacity-0 group-hover:opacity-100"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="animate-pulse">Creating Magic...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">✨</span>
            <span>Create New Space</span>
            <span className="text-2xl group-hover:animate-bounce">🚀</span>
          </>
        )}
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
    </button>
  );
};

// Copy button component with transition feedback
const GlobalApiCopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      variant="outline"
      size="sm"
      className={`shrink-0 transition-all duration-200 ${
        copied ? "bg-green-600 border-green-600 text-white" : ""
      }`}
    >
      {copied ? (
        <>
          <FiCheck className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <FiCopy className="w-4 h-4 mr-2" />
          Copy
        </>
      )}
    </Button>
  );
};

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textFeedbackCount, setTextFeedbackCount] = useState(0);
  const [videoFeedbackCount, setVideoFeedbackCount] = useState(0);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [allFeedback, setAllFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const response = await fetch(
          `http://localhost:3000/getSpacesByUserId/${userId}`
        );

        if (response.status === 404) {
          setSpaces([]);
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const result = await response.json();
          setSpaces(result);

          if (cookieConsent === "accepted") {
            const spaceNames = result.map((space) => space.spacename);
            document.cookie = `spaceNames=${JSON.stringify(
              spaceNames
            )}; path=/; max-age=${24 * 60 * 60}`;
          }

          if (result.length > 0) {
            // Fetch feedback counts and all feedback for sentiment analysis
            const feedbackCountsResponse = await fetch(
              `http://localhost:3000/space/${result[0].publicUrl}/feedbackCounts`
            );
            if (!feedbackCountsResponse.ok) {
              throw new Error(
                `HTTP error! status: ${feedbackCountsResponse.status}`
              );
            }
            const feedbackCounts = await feedbackCountsResponse.json();
            setTextFeedbackCount(feedbackCounts.textFeedbackCount);
            setVideoFeedbackCount(feedbackCounts.videoFeedbackCount);

            // Fetch all feedback for sentiment analysis
            try {
              const allFeedbackResponse = await fetch(
                `http://localhost:3000/space/${result[0].publicUrl}/feedbackDetails`
              );
              if (allFeedbackResponse.ok) {
                const feedbackData = await allFeedbackResponse.json();
                setAllFeedback(feedbackData);
              }
            } catch (feedbackError) {
              console.log(
                "Could not fetch feedback for sentiment analysis:",
                feedbackError
              );
            }
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
    sessionStorage.setItem("selectedSpace", JSON.stringify(space));
    navigate("/space-details");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAcceptCookies = () => {
    setCookieConsent("accepted");
    localStorage.setItem("cookieConsent", "accepted");
  };

  const handleRejectCookies = () => {
    setCookieConsent("rejected");
    localStorage.setItem("cookieConsent", "rejected");
  };

  useEffect(() => {
    const existingConsent = localStorage.getItem("cookieConsent");
    if (existingConsent) {
      setCookieConsent(existingConsent);
    }
  }, []);

  const totalFeedback = textFeedbackCount + videoFeedbackCount;
  const feedbackGrowth = 12.5; // Mock growth percentage

  return (
    <>
      <style jsx>{`
        @keyframes magicalGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }
      `}</style>
      <AnimatedBackground variant="default">
        {/* Navigation */}
        <nav className="relative z-10 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-bg">K</span>
                </div>
                <span className="text-xl font-bold text-gray-100">KiKi</span>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleProfileClick}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0 transition-all duration-200 ease-out hover:scale-110 hover:bg-gray-800/50"
                >
                  <FiUser className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <header className="mb-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                  Welcome back to your
                  <span className="block gradient-text">
                    feedback dashboard
                  </span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Monitor customer insights, track performance, and drive growth
                  with actionable feedback data.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagicalCreateButton />
              </div>
            </header>

            {/* Stats Overview */}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center">
                      <FiMessageSquare className="w-6 h-6 text-brand" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Growth</div>
                      <div className="text-sm font-medium text-green-400">
                        +{feedbackGrowth}%
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {totalFeedback}
                  </div>
                  <div className="text-sm text-gray-500">Total Feedback</div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <FiVideo className="w-6 h-6 text-purple-400" />
                    </div>
                    <VideoFeedbackComingSoon />
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {videoFeedbackCount}
                  </div>
                  <div className="text-sm text-gray-500">Video Feedback</div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">This month</div>
                      <div className="text-sm font-medium text-green-400">
                        +12.1%
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-1">
                    {textFeedbackCount}
                  </div>
                  <div className="text-sm text-gray-500">Text Feedback</div>
                </div>
              </div>
            </section>

            {/* Feedback Emotions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                Customer Sentiment
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    gif: happyGif,
                    label: "Happy",
                    count: 45,
                    color: "success",
                  },
                  {
                    gif: palmGif,
                    label: "Satisfied",
                    count: 32,
                    color: "primary",
                  },
                  {
                    gif: angryGif,
                    label: "Frustrated",
                    count: 18,
                    color: "warning",
                  },
                  {
                    gif: cryingGif,
                    label: "Disappointed",
                    count: 5,
                    color: "error",
                  },
                ].map((emotion, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-4 text-center"
                  >
                    <img
                      src={emotion.gif}
                      alt={emotion.label}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg"
                    />
                    <div className="text-lg font-semibold text-gray-100 mb-1">
                      {emotion.count}
                    </div>
                    <div className="text-sm text-gray-500">{emotion.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* API Integration Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  API Integration
                </h2>
                <Button
                  onClick={() => navigate("/api-docs")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FiBarChart2 className="w-4 h-4" />
                  View Documentation
                </Button>
              </div>

              <div className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                    <FiBarChart2 className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Organization API
                    </h3>
                    <p className="text-sm text-gray-400">
                      Get all feedback data from all your spaces
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                      GET
                    </span>
                    <span className="text-xs text-gray-400">
                      All Organization Feedbacks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-green-400 text-sm break-all font-mono">
                      {`http://localhost:3000/api/organization/${
                        localStorage.getItem("userId") || "USER_ID"
                      }/feedbacks`}
                    </code>
                    <GlobalApiCopyButton
                      url={`http://localhost:3000/api/organization/${
                        localStorage.getItem("userId") || "USER_ID"
                      }/feedbacks`}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <p className="text-xs text-blue-300/80">
                    This API returns JSON data with all feedback from all your
                    spaces including ratings, responses, and timestamps. Perfect
                    for dashboard integrations.
                  </p>
                </div>
              </div>
            </section>

            {/* Spaces Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  Your Spaces
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ease-out hover:scale-105 ${
                      viewMode === "grid"
                        ? "bg-gray-800 text-brand shadow-md"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ease-out hover:scale-105 ${
                      viewMode === "list"
                        ? "bg-gray-800 text-brand shadow-md"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading spaces...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 mb-4">⚠️</div>
                  <p className="text-gray-400">Error: {error}</p>
                </div>
              ) : spaces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                    <img
                      src={treeImg}
                      alt="No spaces"
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">
                    No spaces yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first space to start collecting customer
                    feedback
                  </p>
                  <MagicalCreateButton />
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {spaces.map((space) => (
                    <div
                      key={space._id}
                      onClick={() => handleSpaceClick(space)}
                      className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl hover:border-gray-600 hover:bg-gray-900/70 hover:shadow-2xl p-6 cursor-pointer group transition-all duration-300 ease-out hover:scale-105"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand/20 to-brand-600/20 flex items-center justify-center">
                          <FiZap className="w-6 h-6 text-brand" />
                        </div>
                        <FiArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">
                        {space.spacename}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Click to view details and manage feedback
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
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
            <div className="bg-gray-900/60 border border-gray-700 backdrop-blur-sm shadow-xl rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <FiShield className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We use cookies to enhance your experience and analyze site
                    usage.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAcceptCookies}
                      variant="primary"
                      size="sm"
                      className="transition-all duration-200 ease-out hover:scale-105"
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={handleRejectCookies}
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 ease-out hover:scale-105"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatedBackground>
    </>
  );
};

export default Dashboard;
