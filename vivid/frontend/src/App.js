import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './pages/home/HomePage';
import { getUserProfile } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch user profile
        await getUserProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // If profile fetch fails, user is not authenticated
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any stored tokens or user data
    localStorage.clear();
  };

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/home" replace />
            )} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to="/home" replace />
            )} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? (
              <HomePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
