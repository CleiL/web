import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrcamentosList() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/orcamentos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setOrcamentos(res.data))
      .catch(() => setError('Erro ao carregar orçamentos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Orçamentos</h2>
      <ul>
        {orcamentos.map((o: any) => (
          <li key={o.id}>
            Cliente: {o.clienteId} | Veículo: {o.veiculoId} | Valor: R$ {o.valorTotal} | Status: {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
