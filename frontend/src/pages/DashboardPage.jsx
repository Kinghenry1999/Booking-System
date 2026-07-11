import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getProfile, logout } from '../services/authService';
import AdminDashboard from './AdminDashboard';
import ProviderDashboard from './ProviderDashboard';
import CustomerDashboard from './CustomerDashboard';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        logout();
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (user.role === 'admin') return <AdminDashboard user={user} />;
  if (user.role === 'provider') return <ProviderDashboard user={user} />;
  return <CustomerDashboard user={user} />;
};

export default DashboardPage;