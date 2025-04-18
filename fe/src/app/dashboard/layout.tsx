import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "../globals.css";
import "./DashboardLayout.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
