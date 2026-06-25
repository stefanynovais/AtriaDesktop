import Sidebar from "../Sidebar";
import Header from "../Header";
import "./style.css";

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