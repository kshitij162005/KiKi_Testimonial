import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiPlay, 
  FiCheck, 
  FiStar, 
  FiZap, 
  FiShield, 
  FiTrendingUp,
  FiCode,
  FiGlobe,
  FiUsers,
  FiMessageSquare
} from 'react-icons/fi';
import Designer from "../Images/Designer.png";
import GoOn from '../Images/GoOnLogo.png';
import BingeLearn from '../Images/BingeLogo.png';
import GigX from '../Images/GigX.png';
import AnonymX from '../Images/AnonymXLogo.jpeg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Collect testimonials in minutes, not days. Our streamlined process gets you results quickly."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Enterprise-grade security ensures your customer data stays protected and confidential."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Growth Focused",
      description: "Turn feedback into actionable insights that drive real business growth and improvement."
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "No-Code Required",
      description: "Integrate seamlessly with any platform. No developers needed, just copy and paste."
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Connect with customers worldwide through our multilingual and accessible platform."
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together with your team to manage and respond to customer feedback effectively."
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Testimonials Collected" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-surface-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <img src={Designer} alt="Nova" className="w-6 h-6 rounded-lg" />
              </div>
              <span className="text-xl font-bold text-surface-100">Nova</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleLoginClick}
                className="btn-ghost"
              >
                Sign In
              </button>
              <button 
                onClick={handleSignUpClick}
                className="btn-primary"
              >
                Get Started
                <FiArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="md:hidden">
              <button 
                onClick={handleSignUpClick}
                className="btn-primary"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-surface-100 mb-6 leading-tight">
              Collect customer feedback
              <span className="block gradient-text">that drives growth</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform customer experiences with powerful testimonial collection. 
              No coding required, just seamless integration and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={handleSignUpClick}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Collecting Free
                <FiArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="btn-ghost text-lg px-8 py-4 group">
                <FiPlay className="mr-2 w-5 h-5 group-hover:text-primary-400 transition-colors" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-400 mb-2">{stat.number}</div>
                <div className="text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-4">
              Built for the future of customer feedback
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Everything you need to collect, manage, and leverage customer testimonials 
              for business growth and improvement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`card-hover p-8 transition-all duration-500 delay-${index * 100}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-surface-100 mb-3">{feature.title}</h3>
                <p className="text-surface-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-4">
              Trusted by innovative companies
            </h2>
            <p className="text-lg text-surface-400">
              Join thousands of businesses already collecting valuable customer feedback
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[GoOn, BingeLearn, AnonymX, GigX].map((logo, index) => (
              <div key={index} className="p-6 rounded-xl bg-surface-900/50 border border-surface-800 hover:border-surface-700 transition-all duration-300">
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="card p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-6">
              Ready to transform your customer feedback?
            </h2>
            <p className="text-lg text-surface-400 mb-8 max-w-2xl mx-auto">
              Start collecting testimonials today and turn customer insights into business growth. 
              No credit card required, no setup fees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleSignUpClick}
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started Free
                <FiArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="btn-ghost text-lg px-8 py-4">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 lg:px-8 border-t border-surface-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <img src={Designer} alt="Nova" className="w-5 h-5 rounded" />
              </div>
              <span className="text-lg font-semibold text-surface-100">Nova</span>
            </div>
            <div className="text-sm text-surface-500">
              © 2024 Nova Testimonial. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
