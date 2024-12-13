import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Pages/firebase.js'; 

import App from './Pages/App.js';
import AdminLogin from './Pages/AdminLogin.js';
import AdminBank2 from './Pages/AdminBank.js';
import AdminShop from './Pages/AdminShop.js';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getDatabase();
          const adminRef = ref(db, `admins/${user.uid}`);
          const snapshot = await get(adminRef);
          
          setIsAuthenticated(snapshot.exists() && snapshot.val().allowed === true);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route 
        path="/adminBank" 
        element={
          <PrivateRoute>
            <AdminBank2 />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/adminShop" 
        element={
          <PrivateRoute>
            <AdminShop />
          </PrivateRoute>
        } 
      />
    </Routes>
  </Router>
);

export default AppRoutes;