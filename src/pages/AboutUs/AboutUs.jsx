import './AboutUs.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import placeholderPic from '../../assets/Placeholder_Pic.jpg';

function AboutUs() {
    return (
        <div className="aboutus-page">
            <TopBar />

            <div className="stars-overlay"></div>

            <section className="aboutus-section">
                <h1>Sobre nós</h1>
                <p>
                    O projeto Atria dedica-se a mudar a vida de estudantes autodidatas oferecendo uma ferramenta 100% gratuita que trabalha com o aprendizado ativo e dinâmico. Nossas soluções jogáveis e ferramenta de streaks facilitam o processo de aprendizado e apresentam melhores resultados.
                    A idealização do projeto foi feita em 2025 por quatro estudantes da ETEC Bento Quirino como projeto de conclusão de curso.
                </p>
            </section>

            <section className="aboutus-section">
                <h1 className="team-title">Conheça a equipe!</h1>

                <div className="team-grid">
                    <div className="team-member">
                        <img src={placeholderPic} alt="Nome" className="team-photo" />
                        <p className="team-name">nome</p>
                        <p className="team-role">função/como contribui</p>
                    </div>

                    <div className="team-member">
                        <img src={placeholderPic} alt="Nome" className="team-photo" />
                        <p className="team-name">nome</p>
                        <p className="team-role">função/como contribui</p>
                    </div>

                    <div className="team-member">
                        <img src={placeholderPic} alt="Nome" className="team-photo" />
                        <p className="team-name">nome</p>
                        <p className="team-role">função/como contribui</p>
                    </div>

                    <div className="team-member">
                        <img src={placeholderPic} alt="Nome" className="team-photo" />
                        <p className="team-name">nome</p>
                        <p className="team-role">função/como contribui</p>
                    </div>
                </div>

            </section>

            <section className="aboutus-section footer-section">
                <BottomBar />
            </section>
        </div>
    )
}

export default AboutUs;