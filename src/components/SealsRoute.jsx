import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SealsRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== 'seal') return <Navigate to="/" />;

  return children;
};

export default SealsRoute;