import React, { useState } from 'react';
import axios from 'axios';

interface ClienteFormProps {
  onSuccess: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/clientes', { nome, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNome('');
      setEmail('');
      setSuccess('Cliente cadastrado com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao cadastrar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Cliente</h3>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default ClienteForm;
