import { LayoutComponents } from "../../components/LayoutComponents"
import { useState } from "react";
import starAtria from '../../assets/star.png';
import { Link } from 'react-router-dom'

export const Register = () => {
    const [email, setEmail] = useState(""); 
        const [password, setPassword] = useState(""); 
        const [name, setName] = useState("");
    return (
        <LayoutComponents>
              <form className="login-form">
                <span className="login-form-title"> Criar Conta </span>
    
                <span className="login-form-title">
                  <img src={starAtria} alt="ATRIA" />
                </span>
    
                <div className="wrap-input">
                  <input 
                  className={name !== "" ? 'has-val input' : 'input'} //if ternário: se o valor do email for diferente de vazio, adiciona-se a classe "has". Se ele estiver vazio, permanecer só com a classe input.
                  type="email" 
                  value={name}
                  onChange={e => setName(e.target.value)}/> {/* captura o valor recebido */}
                  <span className="focus-input" data-placeholder="Nome"></span>
                </div>

                <div className="wrap-input">
                  <input 
                  className={email !== "" ? 'has-val input' : 'input'} //if ternário: se o valor do email for diferente de vazio, adiciona-se a classe "has". Se ele estiver vazio, permanecer só com a classe input.
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}/> {/* captura o valor recebido */}
                  <span className="focus-input" data-placeholder="Email"></span>
                </div>
    
                <div className="wrap-input">
                  <input 
                  className={password !== "" ? 'has-val input' : 'input'}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)} />
                  <span className="focus-input" data-placeholder="Password"></span>
                </div>
    
                <div className="container-login-form-btn">
                  <button className="login-form-btn">Login</button>
                </div>
    
                <div className="text-center">
                  <span className="txt1">Já possui conta?</span>
                  <Link to="/login" className="txt2"> Acessar com Email e Senha.</Link>
                </div>
    
              </form>
        </LayoutComponents>
    )
}