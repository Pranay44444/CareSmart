import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mock context module
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate globally
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders email input', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByPlaceholderText('you@example.com')).toBeDefined();
  });

  test('renders password input', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined();
  });

  test('renders submit button', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });

  test('shows error message on login fail', async () => {
    const mockLogin = vi.fn().mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    useAuth.mockReturnValue({ login: mockLogin, isAuthenticated: false });
    
    render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });
});
