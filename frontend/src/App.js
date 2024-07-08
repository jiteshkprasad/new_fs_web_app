// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = () => {
    fetch('http://localhost:5000/api/check-auth', { 
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        console.log('Auth status:', data.isLoggedIn);
      })
      .catch(err => console.error('Error checking auth status:', err));
  };

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('focus', checkAuthStatus);
    return () => window.removeEventListener('focus', checkAuthStatus);
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', { 
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        return response.text();
      })
      .then(() => {
        setIsLoggedIn(false);
        console.log('Logged out successfully');
      })
      .catch(err => {
        console.error('Error logging out:', err);
        alert('Failed to logout. Please try again.');
      });
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <MainContent isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}

export default App;
