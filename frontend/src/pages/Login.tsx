import { useState } from "react";
import { toast } from "react-toastify";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Login successful!");
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-wrapper">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-input-wrapper">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-options">
            <label className="auth-checkbox-label">
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Remember me
            </label>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <div className="auth-spinner"></div> : <span>Sign In</span>}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <a href="/register" className="auth-link">Sign up</a>
        </div>
      </div>
    </div>
  );
}
