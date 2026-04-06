import { render, screen } from '@testing-library/react';
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

// Mock useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('ProductCard Component', () => {
  const mockProduct = {
    _id: 'prod123',
    name: 'Wireless Charger',
    price: 39.99,
    category: 'smartphone',
    stock: 5,
    ratings: 4.5,
    numReviews: 10,
  };

  test('renders product name', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('Wireless Charger')).toBeDefined();
  });

  test('renders product price converted to INR', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    // Luxury UI shows INR: price * 83
    const expectedINR = (39.99 * 83).toFixed(0);
    expect(screen.getByText(`₹${expectedINR}`)).toBeDefined();
  });

  test('renders category badge', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('smartphone')).toBeDefined();
  });

  test('Reserve button exists when in stock', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    // Luxury UI uses "Reserve" instead of "Add to Cart"
    expect(screen.getByRole('button', { name: /Reserve/i })).toBeDefined();
  });

  test('Details link links to correct product page', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    // Luxury UI uses "Details" instead of "View Details"
    const viewLink = screen.getByText(/Details/i).closest('a');
    expect(viewLink.getAttribute('href')).toBe('/products/prod123');
  });

  test('shows "Out of Stock" when stock is zero', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(
      <BrowserRouter>
        <ProductCard product={outOfStockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('Out of Stock')).toBeDefined();
  });

  test('renders review count', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { name: 'Test' } });
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('(10 reviews)')).toBeDefined();
  });
});
