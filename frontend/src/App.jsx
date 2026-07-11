import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import ServiceBookingPage from './pages/ServiceBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminAvailabilityPage from './pages/AdminAvailabilityPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminProvidersPage from './pages/AdminProvidersPage';
import AdminBookingsPage from './pages/AdminBookingsPage';   // <-- new
import ProviderAvailabilityPage from './pages/ProviderAvailabilityPage';
import ProviderBookingsPage from './pages/ProviderBookingsPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book/:serviceId" element={<ServiceBookingPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/my-bookings"
          element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/availability"
          element={<ProtectedRoute><AdminAvailabilityPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/services"
          element={<ProtectedRoute><AdminServicesPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/providers"
          element={<ProtectedRoute><AdminProvidersPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/bookings"
          element={<ProtectedRoute><AdminBookingsPage /></ProtectedRoute>}
        />
        <Route
          path="/provider/availability"
          element={<ProtectedRoute><ProviderAvailabilityPage /></ProtectedRoute>}
        />
        <Route
          path="/provider/bookings"
          element={<ProtectedRoute><ProviderBookingsPage /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;