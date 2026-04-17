import React, { useEffect, useState } from 'react';
import axios from 'axios';

import VeiculoForm from './VeiculoForm';

export default function VeiculosList() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editVeiculo, setEditVeiculo] = useState<any>(null);

  const fetchVeiculos = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/veiculos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setVeiculos(res.data))
      .catch(() => setError('Erro ao carregar veículos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Veículos</h2>
      {editVeiculo && <VeiculoForm veiculo={editVeiculo} onSuccess={() => { setEditVeiculo(null); fetchVeiculos(); }} />}
      <VeiculoForm onSuccess={fetchVeiculos} />
      <ul>
        {veiculos.map((v: any) => (
          <li key={v.id}>
            Placa: {v.placa} | Modelo: {v.modelo} | Ano: {v.ano} | Cor: {v.cor} | Cliente: {v.clienteId}
            <button onClick={async () => {
              await axios.delete(`http://localhost:5000/api/veiculos/${v.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              fetchVeiculos();
            }}>Excluir</button>
            <button onClick={() => setEditVeiculo(v)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

