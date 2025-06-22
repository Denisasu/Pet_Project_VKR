import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return storedUser && token ? JSON.parse(storedUser) : null;
});

  // Функция для входа
  const login = (userData, rememberMe) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("user");
      // accessToken уже сохраняется в Login.jsx
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("user");
      // accessToken уже сохраняется в Login.jsx
    }
    console.log("User logged in:", userData);
  };

  // Функция для выхода
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    console.log("User logged out");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
