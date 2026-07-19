import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './style.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="background-dots"></div>
        <Header />

        {children}
      </div>
    </div>
  );
}
