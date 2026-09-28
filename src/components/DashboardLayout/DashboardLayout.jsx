import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './style.css';

export default function DashboardLayout({ children, hideHeader = false, hideDots = false }) {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {!hideDots && <div className="background-dots"></div>}
        {!hideHeader && <Header />}

        {children}
      </div>
    </div>
  );
}
