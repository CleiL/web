import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
}

const FornecedoresList: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFornecedor, setEditFornecedor] = useState<Fornecedor|null>(null);

  const fetchFornecedores = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/fornecedores', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setFornecedores(res.data))
      .catch(() => setFornecedores([]))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchFornecedores();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Fornecedores</h2>
      {editFornecedor && <EditFornecedorForm fornecedor={editFornecedor} onSuccess={fetchFornecedores} onCancel={()=>setEditFornecedor(null)} />}
      <FornecedorForm onSuccess={fetchFornecedores} />
      <ul>
        {fornecedores.map(fornecedor => (
          <li key={fornecedor.id}>{fornecedor.nome} ({fornecedor.cnpj}) <button onClick={async () => {
            await axios.delete(`http://localhost:5000/api/fornecedores/${fornecedor.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            reload();
          }}>Excluir</button> <button onClick={() => setEditFornecedor(fornecedor)}>Editar</button></li>
        ))}
      </ul>
    </div>
  );
};

const FornecedorForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/fornecedores', { nome, cnpj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNome('');
      setCnpj('');
      setSuccess('Fornecedor cadastrado com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao cadastrar fornecedor');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Fornecedor</h3>
      <input type="text" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="text" placeholder="CNPJ" value={cnpj} onChange={e=>setCnpj(e.target.value)} required />
      <button type="submit">Cadastrar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

const EditFornecedorForm = ({ fornecedor, onSuccess, onCancel }: any) => {
  const [nome, setNome] = useState(fornecedor.nome);
  const [cnpj, setCnpj] = useState(fornecedor.cnpj);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/fornecedores/${fornecedor.id}`, { nome, cnpj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch {
      setError('Erro ao editar fornecedor');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{background:'#eee',padding:16,marginBottom:16}}>
      <h3>Editar Fornecedor</h3>
      <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="text" value={cnpj} onChange={e=>setCnpj(e.target.value)} required />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default FornecedoresList;
