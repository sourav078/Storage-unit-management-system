import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { userInfo, loading } = useAuth();

  if (loading) return null;

  if (!userInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userInfo?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;