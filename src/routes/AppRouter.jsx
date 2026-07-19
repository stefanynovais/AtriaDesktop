import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Decks from '../pages/Decks/Decks';
import Perfil from '../pages/Perfil/Perfil';
import Info from '../pages/Info/Info';
import Turmas from '../pages/Turmas/Turmas';
import { Register } from '../pages/Register/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas — acessíveis sem estar logado */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        {/* Rotas protegidas — só acessíveis com login válido */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/decks"
          element={
            <ProtectedRoute>
              <Decks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turmas"
          element={
            <ProtectedRoute>
              <Turmas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <Info />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};
