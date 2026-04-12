import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
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
  AIAdvisorPage,
} from './pages/index';

// ── Route Guards ──────────────────────────────────────────────────────────────

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

/** Redirect logged-in admins away from the consumer home page */
const HomeRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  return <Home />;
};

// ── App Shell ─────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomeRoute />} />
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
