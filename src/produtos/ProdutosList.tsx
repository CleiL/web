import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

const ProdutosList: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduto, setEditProduto] = useState<Produto|null>(null);

  const fetchProdutos = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/produtos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setProdutos(res.data))
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
  };


  useEffect(() => {
    fetchProdutos();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Produtos</h2>
      {editProduto && <EditProdutoForm produto={editProduto} onSuccess={fetchProdutos} onCancel={()=>setEditProduto(null)} />}
      <ProdutoForm onSuccess={fetchProdutos} />
      <ul>
        {produtos.map(produto => (
          <li key={produto.id}>{produto.nome} (R$ {produto.preco.toFixed(2)}) <button onClick={async () => {
            await axios.delete(`http://localhost:5000/api/produtos/${produto.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            reload();
          }}>Excluir</button> <button onClick={() => setEditProduto(produto)}>Editar</button></li>
        ))}
      </ul>
    </div>
  );
};

const ProdutoForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/produtos', { nome, preco: parseFloat(preco) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNome('');
      setPreco('');
      setSuccess('Produto cadastrado com sucesso!');
      onSuccess();
    } catch {
      setError('Erro ao cadastrar produto');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Produto</h3>
      <input type="text" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="number" placeholder="Preço" value={preco} onChange={e=>setPreco(e.target.value)} required step="0.01" />
      <button type="submit">Cadastrar</button>
      {success && <div style={{color:'green'}}>{success}</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

const EditProdutoForm = ({ produto, onSuccess, onCancel }: any) => {
  const [nome, setNome] = useState(produto.nome);
  const [preco, setPreco] = useState(produto.preco.toString());
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`http://localhost:5000/api/produtos/${produto.id}`, { nome, preco: parseFloat(preco) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onSuccess();
    } catch {
      setError('Erro ao editar produto');
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{background:'#eee',padding:16,marginBottom:16}}>
      <h3>Editar Produto</h3>
      <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input type="number" value={preco} onChange={e=>setPreco(e.target.value)} required step="0.01" />
      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
};

export default ProdutosList;
