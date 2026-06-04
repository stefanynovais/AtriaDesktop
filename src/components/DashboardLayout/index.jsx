import Sidebar from "../Sidebar";
import Header from "../Header";
import "./style.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Header />

        {children}
      </div>
    </div>
  );
}