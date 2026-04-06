import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mock context module
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate
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
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    // Luxury UI redesign changed placeholder to match security-themed copy
    expect(screen.getByPlaceholderText('alias@domain.com')).toBeDefined();
  });

  test('renders password input', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('••••••••')).toBeDefined();
  });

  test('renders submit button', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    // Luxury UI uses "Secure Login" instead of "Sign In"
    expect(screen.getByRole('button', { name: /Secure Login/i })).toBeDefined();
  });

  test('shows error message on login fail', async () => {
    const mockLogin = vi.fn().mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });
    useAuth.mockReturnValue({ login: mockLogin, isAuthenticated: false });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('alias@domain.com'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Secure Login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });

  test('renders register link', () => {
    useAuth.mockReturnValue({ login: vi.fn(), isAuthenticated: false });
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    // Luxury UI uses "Enroll here" instead of "Create one"
    expect(screen.getByText('Enroll here')).toBeDefined();
  });
});
