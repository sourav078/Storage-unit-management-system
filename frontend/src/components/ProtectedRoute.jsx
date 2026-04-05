import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userInfo, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;