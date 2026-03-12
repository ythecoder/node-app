import { useState } from "react";
import type { User } from "../models/User";
import "./Home.css";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // CREATE + UPDATE
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (editId !== null) {
      setUsers(
        users.map((u) =>
          u.id === editId ? { ...u, name, email } : u
        )
      );
      setEditId(null);
    } else {
      const newUser: User = {
        id: Date.now(),
        name,
        email,
      };

      setUsers([...users, newUser]);
    }

    setName("");
    setEmail("");
  };

  // DELETE
  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // EDIT
  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  return (
    <div className="container">
      <h2 className="title">User Management</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {users.map((user) => (
        <div className="user" key={user.id}>
          <span>
            {user.name} — {user.email}
          </span>

          <div className="actions">
            <button
              className="edit"
              onClick={() => editUser(user)}
            >
              Edit
            </button>

            <button
              className="delete"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}