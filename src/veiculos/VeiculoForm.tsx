import React, { useState } from 'react';
import axios from 'axios';

export default function VeiculoForm({ onSuccess, veiculo }: { onSuccess: () => void, veiculo?: any }) {
  const [placa, setPlaca] = useState(veiculo?.placa || '');
  const [modelo, setModelo] = useState(veiculo?.modelo || '');
  const [ano, setAno] = useState(veiculo?.ano || '');
  const [cor, setCor] = useState(veiculo?.cor || '');
  const [clienteId, setClienteId] = useState(veiculo?.clienteId || '');
  const [chassi, setChassi] = useState(veiculo?.chassi || '');
  const [marca, setMarca] = useState(veiculo?.marca || '');
  const [tipo, setTipo] = useState(veiculo?.tipo || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!placa || !modelo || !ano || !cor || !clienteId || !chassi || !marca || !tipo) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (veiculo) {
        await axios.put(`http://localhost:5000/api/veiculos/${veiculo.id}`, { placa, modelo, ano: Number(ano), cor, clienteId, chassi, marca, tipo }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/veiculos', { placa, modelo, ano: Number(ano), cor, clienteId, chassi, marca, tipo }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setSuccess('Veículo salvo com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao salvar veículo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{veiculo ? 'Editar Veículo' : 'Novo Veículo'}</h3>
      <input placeholder="Placa" value={placa} onChange={e => setPlaca(e.target.value)} required />
      <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} required />
      <input placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} required type="number" />
      <input placeholder="Cor" value={cor} onChange={e => setCor(e.target.value)} required />
      <input placeholder="ClienteId" value={clienteId} onChange={e => setClienteId(e.target.value)} required />
      <input placeholder="Chassi" value={chassi} onChange={e => setChassi(e.target.value)} required />
      <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} required />
      <input placeholder="Tipo" value={tipo} onChange={e => setTipo(e.target.value)} required />
      <button type="submit">Salvar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
