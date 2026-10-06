import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './CampoSenha.css';

// Campo de senha com o "olhinho" que mostra/esconde o que foi digitado.
// Usado no Login e nos dois cadastros, pra os três ficarem iguais.
const CampoSenha = ({ value, onChange, autoComplete, required }) => {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="campo-senha">
      <input
        type={visivel ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
      {/* type="button": sem isso, clicar no olho enviaria o formulário */}
      <button
        type="button"
        className="campo-senha-olho"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        title={visivel ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {visivel ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default CampoSenha;
