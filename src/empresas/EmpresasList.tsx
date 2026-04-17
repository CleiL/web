import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
}

const EmpresasList: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEmpresa, setEditEmpresa] = useState<Empresa|null>(null);

  const fetchEmpresas = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/empresas', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setEmpresas(res.data))
      .catch(() => setEmpresas([]))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchEmpresas();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Empresas</h2>
      {editEmpresa && <EditEmpresaForm empresa={editEmpresa} onSuccess={fetchEmpresas} onCancel={()=>setEditEmpresa(null)} />}
      <EmpresaForm onSuccess={fetchEmpresas} />
      <ul>
        {empresas.map(empresa => (
          <li key={empresa.id}>{empresa.nome} ({empresa.cnpj}) <button onClick={async () => {
            await axios.delete(`http://localhost:5000/api/empresas/${empresa.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            reload();
          }}>Excluir</button> <button onClick={() => setEditEmpresa(empresa)}>Editar</button></li>
        ))}
      </ul>
    </div>
  );
};

const EmpresaForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/empresas', { nome, cnpj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNome('');
      setCnpj('');
      setSuccess('Empresa cadastrada com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao cadastrar empresa');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Nova Empresa</h3>
      <input type="text" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="text" placeholder="CNPJ" value={cnpj} onChange={e=>setCnpj(e.target.value)} required />
      <button type="submit">Cadastrar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

const EditEmpresaForm = ({ empresa, onSuccess, onCancel }: any) => {
  const [nome, setNome] = useState(empresa.nome);
  const [cnpj, setCnpj] = useState(empresa.cnpj);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/empresas/${empresa.id}`, { nome, cnpj }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch {
      setError('Erro ao editar empresa');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{background:'#eee',padding:16,marginBottom:16}}>
      <h3>Editar Empresa</h3>
      <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="text" value={cnpj} onChange={e=>setCnpj(e.target.value)} required />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default EmpresasList;
