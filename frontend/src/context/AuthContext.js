import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;
      setUserInfo(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      const data = response.data;
      setUserInfo(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  const isAuthenticated = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);