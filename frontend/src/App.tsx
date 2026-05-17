import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";
import StaffPage from "./pages/Staff";
import Admissions from "./pages/Admissions";
import Leaves from "./pages/Leaves";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* GLOBAL TOAST CONTAINER */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />

        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">🎓</div>
            <div className="brand-text">
              College <span>Management</span>
            </div>
          </div>
          <nav className="sidebar-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="icon">📊</span> Dashboard
            </NavLink>
            <NavLink to="/students" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="icon">👨‍🎓</span> Students
            </NavLink>
            <NavLink to="/staff" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="icon">👨‍🏫</span> Staff
            </NavLink>
            <NavLink to="/admissions" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="icon">📝</span> Admissions
            </NavLink>
            <NavLink to="/leaves" className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}>
              <span className="icon">📅</span> Leaves
            </NavLink>
          </nav>
        </aside>

        <div className="main-wrapper">
          <header className="navbar">
            <div className="nav-container">
              <div className="nav-actions">
                <Link to="/login" className="btn-text" style={{ textDecoration: 'none' }}>Login</Link>
                <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
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
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;