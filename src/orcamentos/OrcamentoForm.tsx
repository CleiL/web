import React, { useState } from 'react';
import axios from 'axios';

export default function OrcamentoForm({ onSuccess, orcamento }: { onSuccess: () => void, orcamento?: any }) {
  const [clienteId, setClienteId] = useState(orcamento?.clienteId || '');
  const [veiculoId, setVeiculoId] = useState(orcamento?.veiculoId || '');
  const [status, setStatus] = useState(orcamento?.status || 'Pendente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!clienteId || !veiculoId) {
      setError('Cliente e Veículo são obrigatórios');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (orcamento) {
        await axios.put(`http://localhost:5000/api/orcamentos/${orcamento.id}`, { clienteId, veiculoId, status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/orcamentos', { clienteId, veiculoId, status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSuccess('Orçamento salvo com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao salvar orçamento');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{orcamento ? 'Editar Orçamento' : 'Novo Orçamento'}</h3>
      <input placeholder="ClienteId" value={clienteId} onChange={e => setClienteId(e.target.value)} required />
      <input placeholder="VeiculoId" value={veiculoId} onChange={e => setVeiculoId(e.target.value)} required />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="Pendente">Pendente</option>
        <option value="Aprovado">Aprovado</option>
        <option value="Rejeitado">Rejeitado</option>
      </select>
      <button type="submit">Salvar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
