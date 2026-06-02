import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Admissions from "./pages/Admissions";
import Home from "./pages/Home";
import Leaves from "./pages/Leaves";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffPage from "./pages/Staff";
import Students from "./pages/Students";
import Experiments from "./pages/Experiments";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/students", label: "Students", icon: "🎓" },
  { to: "/staff", label: "Staff", icon: "🏫" },
  { to: "/admissions", label: "Admissions", icon: "📝" },
  { to: "/leaves", label: "Leaves", icon: "🗓️" },
  { to: "/experiments", label: "Experiments", icon: "🧪" },
];

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const showSidebar = Boolean(token) && !isAuthPage;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {showSidebar && (
        <>
          <div
            className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-brand">
              <div className="brand-icon">🎓</div>
              <div className="brand-text">
                College <span>Management</span>
              </div>
            </div>
            <nav className="sidebar-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "sidebar-item active" : "sidebar-item"
                  }
                  onClick={() =>
                    window.innerWidth <= 900 && setIsSidebarOpen(false)
                  }
                >
                  <span className="icon">{item.icon}</span>
                  <span className="item-text">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}

      <div className="main-wrapper">
        <header className="navbar">
          <div className="nav-container">
            {showSidebar ? (
              <button
                className="sidebar-toggle-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            ) : (
              <Link to="/" className="header-brand">
                <span className="header-brand-icon" aria-hidden="true">
                  🎓
                </span>
                <span className="header-brand-text">
                  College <span>Management</span>
                </span>
              </Link>
            )}

            <div className="nav-actions">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="btn-text"
                  style={{
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn-text"
                    style={{ textDecoration: "none" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                    style={{ textDecoration: "none" }}
                  >
                    Register
                  </Link>
                </>
              )}
              <button className="btn-portal">Admin Portal</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/experiments" element={<Experiments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
