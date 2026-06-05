import Login from '../pages/Login'
import Home from '../pages/Home'
import Decks from '../pages/Decks'
import Perfil from '../pages/Perfil'
import Info from '../pages/Info'
import { Register } from '../pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigate } from "react-router-dom";

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/decks" element={<Decks />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/info" element={<Info />} />
                  <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

