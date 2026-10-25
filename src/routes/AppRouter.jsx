// src/routes/AppRouter.jsx
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Decks from '../pages/Decks/Decks';
import Perfil from '../pages/Perfil/Perfil';
import Info from '../pages/Info/Info';
import Turmas from '../pages/Turmas/Turmas';
import RevisaoErros from '../pages/RevisaoErros/RevisaoErros';
import DecksProntos from '../pages/DecksProntos/DecksProntos';
import Landing from '../pages/Landing/Landing';
import AboutUs from '../pages/AboutUs/AboutUs';
import AccountType from '../pages/AccountType/AccountType';
import CommonRegister from '../pages/CommonRegister/CommonRegister';
import InstitutionalRegister from '../pages/InstitutionalRegister/InstitutionalRegister';
import Register from '../pages/Register/Register';
import GamesScreen from '../pages/GamesScreen/GamesScreen';
import PresentCards from '../pages/PresentCards/PresentCards';
import Jogos from '../pages/Jogos/Jogos';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import TrueOrFalse from '../pages/TrueOrFalse/TrueOrFalse';
import MemoryGame from '../pages/MemoryGame/MemoryGame';

// Roteador de dados (createBrowserRouter) em vez de BrowserRouter, porque o
// bloqueio do botão voltar (useBlocker, em ProtectedRoute) só funciona nele.
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rotas públicas — acessíveis sem estar logado */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/sobre" element={<AboutUs />} />
      <Route path="/tipo-de-conta" element={<AccountType />} />
      <Route path="/common-register" element={<CommonRegister />} />
      <Route path="/institutional-register" element={<InstitutionalRegister />} />

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
        path="/games/:deckId/verdadeiro-ou-falso"
        element={
          <ProtectedRoute>
            <TrueOrFalse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/games/:deckId/jogo-da-memoria"
        element={
          <ProtectedRoute>
            <MemoryGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jogos"
        element={
          <ProtectedRoute>
            <Jogos />
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
        path="/decks-prontos"
        element={
          <ProtectedRoute>
            <DecksProntos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revisao-erros"
        element={
          <ProtectedRoute>
            <RevisaoErros />
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
      <Route
        path="/games/:deckId"
        element={
          <ProtectedRoute>
            <GamesScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/games/:deckId/apresentar-cartoes"
        element={
          <ProtectedRoute>
            <PresentCards />
          </ProtectedRoute>
        }
      />
    </>
  ),
  // Em produção (GitHub Pages) o site fica em /AtriaDesktop; em dev, BASE_URL é "/".
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined }
);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
