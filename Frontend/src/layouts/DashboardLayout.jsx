import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: "28px",
          overflowY: "auto",
          background: "#0A0A0F"
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;