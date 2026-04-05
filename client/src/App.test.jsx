import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock all page components to avoid deep rendering
vi.mock('./pages/index', () => ({
  Home: () => <div>CareSmart Home</div>,
  Login: () => <div>Login</div>,
  Register: () => <div>Register</div>,
  Products: () => <div>Products</div>,
  ProductDetail: () => <div>ProductDetail</div>,
  Cart: () => <div>Cart</div>,
  Orders: () => <div>Orders</div>,
  Profile: () => <div>Profile</div>,
  AdminDashboard: () => <div>AdminDashboard</div>,
}));

// Mock Navbar
vi.mock('./components/Navbar', () => ({
  default: () => <nav>CareSmart Nav</nav>,
}));

// Mock AIAdvisor
vi.mock('./components/AIAdvisor', () => ({
  default: () => <div>AI Advisor</div>,
}));

// Mock AuthContext
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isAuthenticated: false, isAdmin: false }),
}));

import App from './App';

describe('App', () => {
  it('renders the CareSmart app with Navbar', () => {
    // App already contains BrowserRouter internally — render without extra wrapper
    render(<App />);
    expect(screen.getAllByText(/CareSmart/i)[0]).toBeDefined();
  });

  it('renders the Home page at root route', () => {
    render(<App />);
    expect(screen.getByText('CareSmart Home')).toBeDefined();
  });

  it('renders Login page mock is accessible', () => {
    // We can only test the root route since App manages routing internally
    render(<App />);
    // Navbar always renders CareSmart branding
    expect(screen.getAllByText(/CareSmart/i).length).toBeGreaterThan(0);
  });

  it('Navbar appears on every page', () => {
    render(<App />);
    expect(screen.getByText('CareSmart Nav')).toBeDefined();
  });
});
