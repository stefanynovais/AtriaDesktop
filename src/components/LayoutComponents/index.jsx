import './styles.css';

export const LayoutComponents = ({children}) => {
    return (
        <div className="container">
            <div className="container-login">
                <div className="wrap-login">{children}</div>
            </div>
        </div>
    )
}