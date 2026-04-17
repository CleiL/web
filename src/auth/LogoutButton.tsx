import React from 'react';

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return <button onClick={handleLogout}>Sair</button>;
};

export default LogoutButton;
