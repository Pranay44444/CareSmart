import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

// Mock context module
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
  test('logged-out state → Sign In and Get Started links shown', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, isAdmin: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);

    // Luxury UI redesign uses "Sign In" and "Get Started"
    expect(screen.getByText('Sign In')).toBeDefined();
    expect(screen.getByText('Get Started')).toBeDefined();

    // Cart and Orders are auth-only — must NOT appear when logged out
    expect(screen.queryByText('Cart')).toBeNull();
    expect(screen.queryByText('Orders')).toBeNull();
  });

  test('logged-in state → Sign Out button and nav links shown', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'John Doe' },
      isAdmin: false,
      logout: vi.fn(),
    });
    render(<BrowserRouter><Navbar /></BrowserRouter>);

    // Luxury navbar uses SVG-icon + text links (no emoji prefix)
    expect(screen.getByText('Sign Out')).toBeDefined();
    expect(screen.getByText('Cart')).toBeDefined();
    expect(screen.getByText('Orders')).toBeDefined();
    // Profile link shows first name only
    expect(screen.getByText('John')).toBeDefined();

    // Logged-out links should be gone
    expect(screen.queryByText('Sign In')).toBeNull();
    expect(screen.queryByText('Get Started')).toBeNull();
  });

  test('always shows Products and AI Advisor links', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, isAdmin: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);

    expect(screen.getByText('Products')).toBeDefined();
    expect(screen.getByText('AI Advisor')).toBeDefined();
  });

  test('Admin link shown only when user is admin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      isAdmin: true,
      logout: vi.fn(),
    });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    // Admin link text — use queryAllByText since it may match multiple nodes
    const adminLinks = screen.queryAllByText('Admin');
    expect(adminLinks.length).toBeGreaterThan(0);
  });
});
