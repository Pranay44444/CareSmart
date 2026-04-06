import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AIAdvisor from './components/AIAdvisor';
import {
  Home,
  Login,
  Register,
  Products,
  ProductDetail,
  Cart,
  Orders,
  Profile,
  AdminDashboard,
} from './pages/index';

// ── Route Guards ──────────────────────────────────────────────────────────────

/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * AdminRoute — redirects non-admin users to /.
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// ── AI Advisor page wrapper ─────────────────────────────────────────────────────
const AIAdvisorPage = () => (
  <div style={{ minHeight: '100vh', background: '#0f0f1a', padding: '48px 24px' }}>
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <AIAdvisor />
    </div>
  </div>
);

// ── App Shell ─────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Protected — require login */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* AI Advisor */}
      <Route path="/ai-advisor" element={<AIAdvisorPage />} />

      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

// ── Root — providers wrap everything ─────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
