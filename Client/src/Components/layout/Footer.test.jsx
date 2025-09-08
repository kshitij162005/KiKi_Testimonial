import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Footer from './Footer';

// Mock the image import
vi.mock('../../Images/kiki_logo.png', () => ({
  default: 'kiki-logo.svg'
}));

const FooterWithRouter = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
);

describe('Footer Component', () => {
  test('renders footer with brand logo and name', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('Kiki')).toBeInTheDocument();
    expect(screen.getByAltText('Kiki')).toBeInTheDocument();
  });

  test('displays current year in copyright', () => {
    render(<FooterWithRouter />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Kiki Testimonial. All rights reserved.`)).toBeInTheDocument();
  });

  test('renders all footer link sections', () => {
    render(<FooterWithRouter />);
    
    // Check section headers
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  test('renders product links', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  test('renders company links', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders support links', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  test('renders legal links', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('GDPR')).toBeInTheDocument();
  });

  test('renders social media links with proper accessibility', () => {
    render(<FooterWithRouter />);
    
    // Check for social media links by aria-label
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('renders company description', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText(/Simple, secure testimonial collection platform/)).toBeInTheDocument();
  });

  test('renders tagline', () => {
    render(<FooterWithRouter />);
    
    expect(screen.getByText('Made with ❤️ for better customer feedback')).toBeInTheDocument();
  });

  test('email link has correct href', () => {
    render(<FooterWithRouter />);
    
    const emailLink = screen.getByLabelText('Email');
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@kiki-testimonial.com');
  });

  test('footer text links have proper hover states', () => {
    render(<FooterWithRouter />);
    
    // Test specific text links that should have transition-colors
    const featuresLink = screen.getByText('Features');
    const aboutLink = screen.getByText('About');
    const privacyLink = screen.getByText('Privacy Policy');
    
    expect(featuresLink).toHaveClass('text-sm', 'text-surface-400', 'hover:text-surface-100', 'transition-colors', 'duration-200');
    expect(aboutLink).toHaveClass('text-sm', 'text-surface-400', 'hover:text-surface-100', 'transition-colors', 'duration-200');
    expect(privacyLink).toHaveClass('text-sm', 'text-surface-400', 'hover:text-surface-100', 'transition-colors', 'duration-200');
  });

  test('footer has proper responsive classes', () => {
    render(<FooterWithRouter />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('relative', 'z-10', 'bg-surface-950', 'border-t', 'border-surface-800');
  });
});