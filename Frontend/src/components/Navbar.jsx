import { useState, useEffect, useRef } from "react";
import { AlertTriangle, Info, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/admin/notifications");
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleNotificationClick = (notification) => {
    navigate(notification.action);
    setShowDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={14} />;
      case "info":
        return <Info size={14} />;
      default:
        return <UserPlus size={14} />;
    }
  };

  const getNotificationColors = (type) => {
    switch (type) {
      case "warning":
        return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
      case "info":
        return { bg: "rgba(79,142,247,0.15)", color: "#4F8EF7" };
      default:
        return { bg: "rgba(155,106,247,0.15)", color: "#9B6AF7" };
    }
  };

  return (
    <div style={{
      background: "#0D0D14",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 28px",
      height: "64px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif"
    }}>
      {/* Left */}
      <div>
        <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#F0EDEA", margin: 0 }}>
          {greeting}, <span style={{ color: "#4F8EF7" }}>{user?.name?.split(" ")[0] || "User"}</span>
        </h1>
        <p style={{ fontSize: "12px", color: "rgba(240,237,234,0.35)", margin: 0, marginTop: "2px" }}>
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Right */}
      
    </div>
  );
}

export default Navbar;