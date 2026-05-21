import Login from '../pages/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Register } from '../pages/Register'

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
            </Routes>
        </Router>
    )
}

