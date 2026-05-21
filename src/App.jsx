import starAtria from './assets/star.png'
import '../src/styles.css'

import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // a palavra class é reservada para indicar uma classe exclusiva do javascript, e aqui queremos indicar uma classe do css, por isso className 
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form">
            <span class Name="login-form-title">Bem Vindo!</span>

            <span class Name="login-form-title">
              <img src={starAtria} alt="ATRIA" />
            </span>

            <div className="wrap-input">
              <input className="input" type="email" />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input className="input" type="password" />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn">Login</button>
            </div>

            <div className="text-center">
              <span className="txt1">Não possui conta?</span>

              <a href="#" className="txt2"> Criar conta.</a>
            </div>

          </form>
        </div>
      </div>
    </div>

  )
}

export default App;
//o React pega uma função em javascript e transforma em html
//exportaremos esse app para o main, e esse renderiza tudo pelo "root"
