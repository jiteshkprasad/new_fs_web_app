// src/components/Header.js
import React from 'react';

function Header({ isLoggedIn, onLogout }) {
  return (
    <header>
      <h1>My Full Stack App</h1>
      {isLoggedIn ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <a href="http://localhost:5000/auth/google">Login with Google</a>
      )}
    </header>
  );
}

export default Header;