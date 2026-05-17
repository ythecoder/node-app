import { useState, useEffect } from "react";
import type { User, UserPayload } from "../models/User";
import "./Home.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000/api/v1/users";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?page=1&limit=50`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    setLoading(true);
    setError(null);

    try {
      const payload: UserPayload = {
        name: trimmedName,
        email: trimmedEmail,
      };

      if (age.trim()) {
        const ageNum = Number(age.trim());
        if (!Number.isNaN(ageNum)) payload.age = ageNum;
      }

      const res = await fetch(editId ? `${API_BASE}/${editId}` : API_BASE, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }

      setName("");
      setEmail("");
      setAge("");
      setEditId(null);
      await fetchUsers();
      toast.success("User added/updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this user?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User): void => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age?.toString() ?? "");
    setEditId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h2>Academic Directory</h2>
        <p>Seamlessly manage faculty, staff, and student records with our unified management system.</p>
      </section>

      {error && (
        <div className="status-toast error-toast">
          <span className="toast-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="management-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <label>Full Name</label>
              <input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper age-input">
              <label>Age (Optional)</label>
              <input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>{editId ? "Update Record" : "Register Individual"}</span>
                {editId ? "✨" : "+"}
              </>
            )}
          </button>
          
          {editId && (
            <button 
              type="button" 
              className="btn-icon" 
              style={{ width: '100%', marginTop: '0.75rem' }}
              onClick={() => {
                setEditId(null);
                setName("");
                setEmail("");
                setAge("");
              }}
            >
              Cancel Update
            </button>
          )}
        </form>
      </div>

      <section className="users-section">
        <div className="section-header">
          <h3>
            Enrolled Individuals
            <span className="badge">{users.length} Total Records</span>
          </h3>
        </div>

        {loading && users.length === 0 ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No user records found. Start by creating one!</p>
          </div>
        ) : (
          <div className="user-grid">
            {users.map((user) => (
              <div className="user-card" key={user._id}>
                <div className="card-header">
                  <div className="avatar">
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="user-meta">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <label>Role</label>
                    <span>Member</span>
                  </div>
                  <div className="detail-item">
                    <label>Age</label>
                    <span>{user.age ?? "N/A"}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-icon btn-edit-icon"
                    onClick={() => handleEdit(user)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-icon btn-delete-icon"
                    onClick={() => handleDelete(user._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
