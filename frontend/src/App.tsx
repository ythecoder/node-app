import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <div className="brand-icon">
                <span className="brand-dot"></span>
                <span className="brand-pulse"></span>
              </div>
              <div className="brand-text">
                College <span>Management</span>
              </div>
            </div>
            <nav className="nav-links">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Dashboard
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Directory
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Support
              </NavLink>
            </nav>
            <div className="nav-actions">
              <button className="btn-portal">Admin Portal</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;