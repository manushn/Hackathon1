import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const Token = sessionStorage.getItem('Token');

  if (!Token) {
    
    return <Navigate to="/login" replace />;
    
  }

  return children;
};

export default ProtectedRoute;