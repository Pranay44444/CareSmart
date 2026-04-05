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
  test('logged-out state → test Login/Register links shown', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, isAdmin: false });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    
    expect(screen.getByText('Sign In')).toBeDefined();
    expect(screen.getByText('Get Started')).toBeDefined();
    
    // Auth-only links should NOT be there
    expect(screen.queryByText('🛒 Cart')).toBeNull();
    expect(screen.queryByText('Orders')).toBeNull();
  });

  test('logged-in state → test Logout button shown', () => {
    useAuth.mockReturnValue({ 
      isAuthenticated: true, 
      user: { name: 'John Doe' }, 
      isAdmin: false,
      logout: vi.fn()
    });
    render(<BrowserRouter><Navbar /></BrowserRouter>);
    
    expect(screen.getByText('Sign Out')).toBeDefined();
    expect(screen.getByText('🛒 Cart')).toBeDefined();
    expect(screen.getByText('Orders')).toBeDefined();
    expect(screen.getByText('👤 John')).toBeDefined(); // Since first name is split
    
    // Logged-out links should NOT be there
    expect(screen.queryByText('Sign In')).toBeNull();
  });
});
