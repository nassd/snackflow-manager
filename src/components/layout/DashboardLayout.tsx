
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <div className="sidebar-area">
        <Sidebar />
      </div>
      <div className="header-area">
        <Header />
      </div>
      <div className="main-area">
        <Outlet />
      </div>
    </div>
  );
}
