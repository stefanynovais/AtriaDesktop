import { useNavigate } from 'react-router-dom';
import './AccountType.css';
import TopBar from '../../components/TopBar/TopBar';
import professorImg from '../../assets/conta professor.png';
import comumImg from '../../assets/conta comum.png';

function AccountType() {
    const navigate = useNavigate();

    return (
        <div className="accounttype-page">
            
            <section className="accounttype-section">
                <h1>Selecione o tipo de conta:</h1>

                <div className="accounttype-options">
                    <img
                        src={professorImg}
                        alt="Cadastro Institucional"
                        className="accounttype-image"
                        onClick={() => navigate('/institutional-register')}
                    />

                    <img
                        src={comumImg}
                        alt="Cadastro Comum"
                        className="accounttype-image"
                        onClick={() => navigate('/common-register')}
                    />
                </div>
            </section>
        </div>
    );
}

export default AccountType;