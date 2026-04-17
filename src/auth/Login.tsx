import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import GoogleLoginButton from './GoogleLoginButton';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Ajuste a URL para o endpoint real do backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err: any) {
      setError(t('login_error') || 'Erro ao entrar');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>{t('login')}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">{t('login')}</button>
      <div style={{margin: '16px 0'}}>
        {/* Google Login Button */}
        <GoogleLoginButton onSuccess={token => {
          // Envie o token para o backend para autenticação
          axios.post('http://localhost:5000/api/auth/google', { token })
            .then(res => {
              localStorage.setItem('token', res.data.token);
              window.location.reload();
            })
            .catch(() => setError(t('login_error') || 'Erro ao entrar'));
        }} />
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default Login;
