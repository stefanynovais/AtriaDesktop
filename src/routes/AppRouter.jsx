import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Decks from '../pages/Decks/Decks';
import Perfil from '../pages/Perfil/Perfil';
import Info from '../pages/Info/Info';
import Turmas from '../pages/Turmas/Turmas';
import Landing from '../pages/Landing/Landing';
import AboutUs from '../pages/AboutUs/AboutUs';
import AccountType from '../pages/AccountType/AccountType';
import CommonRegister from '../pages/CommonRegister/CommonRegister';
import InstitutionalRegister from '../pages/InstitutionalRegister/InstitutionalRegister';
import { Register } from '../pages/Register/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/sobre" element={<AboutUs />} />
        <Route path="/tipo-de-conta" element={<AccountType />} />
        <Route path="/common-register" element={<CommonRegister />} />
        <Route path="/institutional-register" element={<InstitutionalRegister />} />

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
      </Routes>
    </Router>
  );
};