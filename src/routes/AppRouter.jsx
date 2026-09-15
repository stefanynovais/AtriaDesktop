import Login from '../pages/Login/Login.jsx';
import Home from '../pages/Home/Home.jsx';
import Decks from '../pages/Decks/Decks.jsx';
import Perfil from '../pages/Perfil/Perfil.jsx';
import Turmas from '../pages/Turmas/Turmas.jsx';
import SobrePage from '../pages/Sobre/SobrePage.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';
import { Register } from '../pages/Register/Register.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rota pública inicial — a Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sobre" element={<SobrePage />} />

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
      </Routes>
    </Router>
  );
};
