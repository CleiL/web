import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClienteForm from './ClienteForm';

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

const ClientesList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/clientes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setClientes(res.data))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  if (loading) return <div>Carregando...</div>;



const EditClienteForm = ({ cliente, onSuccess, onCancel }: any) => {
  const [nome, setNome] = useState(cliente.nome);
  const [email, setEmail] = useState(cliente.email);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/clientes/${cliente.id}`, { nome, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch {
      setError('Erro ao editar cliente');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{background:'#eee',padding:16,marginBottom:16}}>
      <h3>Editar Cliente</h3>
      <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

return (
    <div>
      <h2>Clientes</h2>
      {editCliente && <EditClienteForm cliente={editCliente} onSuccess={fetchClientes} onCancel={()=>setEditCliente(null)} />}
      <ClienteForm onSuccess={fetchClientes} />
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>{cliente.nome} ({cliente.email}) <button onClick={async () => {
            await axios.delete(`http://localhost:5000/api/clientes/${cliente.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            window.location.reload();
          }}>Excluir</button> <button onClick={() => setEditCliente(cliente)}>Editar</button></li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesList;
