

import "./assets/global.css";

import { AppRouter } from './routes';

{/* Os estados servem para reconhecer o valor dentro do input */}
export const App = () => {
 

  // a palavra class é reservada para indicar uma classe exclusiva do javascript, e aqui queremos indicar uma classe do css, por isso className 
  return (
    <AppRouter></AppRouter>
  
  );
}


//o React pega uma função em javascript e transforma em html
//exportaremos esse app para o main, e esse renderiza tudo pelo "root"
