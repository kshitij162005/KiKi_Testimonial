import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import Designer from "../../Images/Designer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API', href: '#api' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Status', href: '#status' },
      { name: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#twitter', icon: FiTwitter },
    { name: 'LinkedIn', href: '#linkedin', icon: FiLinkedin },
    { name: 'GitHub', href: '#github', icon: FiGithub },
    { name: 'Email', href: 'mailto:hello@nova-testimonial.com', icon: FiMail }
  ];

  return (
    <footer className="relative z-10 bg-surface-950 border-t border-surface-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <img src={Designer} alt="Nova" className="w-6 h-6 rounded-lg" />
              </div>
              <span className="text-xl font-bold text-surface-100">Nova</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed mb-6 max-w-sm">
              Simple, secure testimonial collection platform for businesses of all sizes. 
              Gather valuable customer feedback and insights.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-100 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-surface-100 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-100 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-surface-100 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-100 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-surface-100 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-100 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-surface-400 hover:text-surface-100 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-surface-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-surface-500 mb-4 md:mb-0">
              © {currentYear} Nova Testimonial. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-surface-500">
              <span>Made with ❤️ for better customer feedback</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;