import axios from 'axios';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// ── Request interceptor: attach Bearer token from localStorage ───────────────
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('caresmart_user');
    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore malformed localStorage data
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const loginUser = (email, password) => api.post('/auth/login', { email, password });

export const getProfile = () => api.get('/auth/profile');

export const updateDeviceProfile = (profileData) => api.put('/auth/device-profile', profileData);

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = (params = {}) => api.get('/products', { params });

export const getProduct = (id) => api.get(`/products/${id}`);

export const createProduct = (productData) => api.post('/products', productData);

export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ── Cart ──────────────────────────────────────────────────────────────────────
export const getCart = () => api.get('/cart');

export const addToCart = (productId, qty = 1) => api.post('/cart/add', { productId, qty });

export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);

export const clearCart = () => api.delete('/cart/clear');

// ── Orders ────────────────────────────────────────────────────────────────────
export const placeOrder = (orderData) => api.post('/orders', orderData);

export const getMyOrders = () => api.get('/orders/my');

export const getAllOrders = (params = {}) => api.get('/orders', { params });

export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews = (productId) => api.get(`/reviews/product/${productId}`);

export const createReview = (reviewData) => api.post('/reviews', reviewData);

// ── AI ────────────────────────────────────────────────────────────────────────
export const getAIRecommendations = (data) => api.post('/ai/recommend', data);

export const summarizeReviews = (reviews) => api.post('/ai/summarize-reviews', { reviews });

export default api;
