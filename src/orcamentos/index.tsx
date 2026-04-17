import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrcamentoForm from './OrcamentoForm';

const EditOrcamentoForm = ({ orcamento, onSuccess, onCancel }: any) => {
  return <OrcamentoForm orcamento={orcamento} onSuccess={onSuccess} />;
};

const OrcamentosList: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOrcamento, setEditOrcamento] = useState<any | null>(null);
  const [error, setError] = useState('');

  const fetchOrcamentos = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/orcamentos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setOrcamentos(res.data))
      .catch(() => setError('Erro ao carregar orçamentos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Orçamentos</h2>
      {editOrcamento && <EditOrcamentoForm orcamento={editOrcamento} onSuccess={() => { fetchOrcamentos(); setEditOrcamento(null); }} onCancel={() => setEditOrcamento(null)} />}
      <OrcamentoForm onSuccess={fetchOrcamentos} />
      <ul>
        {orcamentos.map((o: any) => (
          <li key={o.id}>
            Cliente: {o.clienteId} | Veículo: {o.veiculoId} | Valor: R$ {o.valorTotal} | Status: {o.status}
            <button onClick={async () => {
              try {
                await axios.delete(`http://localhost:5000/api/orcamentos/${o.id}`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchOrcamentos();
              } catch {
                setError('Erro ao excluir orçamento');
              }
            }}>Excluir</button>
            <button onClick={() => setEditOrcamento(o)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrcamentosList;
