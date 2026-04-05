import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';

// Mock context module
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock API module
vi.mock('../services/api', () => ({
  addToCart: vi.fn().mockResolvedValue({ data: {} }),
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    _id: 'prod123',
    name: 'Wireless Charger',
    price: 39.99,
    category: 'smartphone',
    stock: 5,
    ratings: 4.5,
    numReviews: 10
  };

  test('renders product name', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    expect(screen.getByText('Wireless Charger')).toBeDefined();
  });

  test('renders product price (converted to INR roughly)', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    const expectedINR = (39.99 * 83).toFixed(0);
    expect(screen.getByText(`₹${expectedINR}`)).toBeDefined();
  });

  test('renders category', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    expect(screen.getByText('smartphone')).toBeDefined();
  });

  test('Add to Cart button exists', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    const btn = screen.getByRole('button', { name: /Add/i });
    expect(btn).toBeDefined();
  });

  test('View button links correctly', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(<BrowserRouter><ProductCard product={mockProduct} /></BrowserRouter>);
    const viewLink = screen.getByText(/View Details/i);
    expect(viewLink.getAttribute('href')).toBe('/products/prod123');
  });
});
