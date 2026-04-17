import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
}

const FuncionariosList: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFuncionario, setEditFuncionario] = useState<Funcionario|null>(null);

  const fetchFuncionarios = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/funcionarios', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setFuncionarios(res.data))
      .catch(() => setFuncionarios([]))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchFuncionarios();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Funcionários</h2>
      {editFuncionario && <EditFuncionarioForm funcionario={editFuncionario} onSuccess={fetchFuncionarios} onCancel={()=>setEditFuncionario(null)} />}
      <FuncionarioForm onSuccess={fetchFuncionarios} />
      <ul>
        {funcionarios.map(funcionario => (
          <li key={funcionario.id}>{funcionario.nome} ({funcionario.email}) <button onClick={async () => {
            await axios.delete(`http://localhost:5000/api/funcionarios/${funcionario.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            reload();
          }}>Excluir</button> <button onClick={() => setEditFuncionario(funcionario)}>Editar</button></li>
        ))}
      </ul>
    </div>
  );
};

const FuncionarioForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/funcionarios', { nome, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNome('');
      setEmail('');
      setSuccess('Funcionário cadastrado com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao cadastrar funcionário');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Funcionário</h3>
      <input type="text" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button type="submit">Cadastrar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

const EditFuncionarioForm = ({ funcionario, onSuccess, onCancel }: any) => {
  const [nome, setNome] = useState(funcionario.nome);
  const [email, setEmail] = useState(funcionario.email);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/funcionarios/${funcionario.id}`, { nome, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch {
      setError('Erro ao editar funcionário');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{background:'#eee',padding:16,marginBottom:16}}>
      <h3>Editar Funcionário</h3>
      <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default FuncionariosList;
