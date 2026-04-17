import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './auth/Login';

import { ClientesList } from './clientes';
import { EmpresasList } from './empresas';
import { FornecedoresList } from './fornecedores';
import { FuncionariosList } from './funcionarios';
import { ProdutosList } from './produtos';
import OrcamentosList from './orcamentos';
import { VeiculosList } from './veiculos';

const Dashboard = () => (
  <>
    <ClientesList />
    <EmpresasList />
    <FornecedoresList />
    <FuncionariosList />
    <ProdutosList />
    <VeiculosList />
  </>
);

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default App;
