import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "./Header";
import { experimentSchema } from "../validators/authSchemas";
import type { ExperimentFormData } from "../validators/authSchemas";
import "./Experiments.css";

export default function Experiments() {
  const [text, setText] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    mode: "onChange", // Show errors in real-time as user types
  });

  // Watch password for strength indicator using useWatch
  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  // Get Password Strength
  const getPasswordStrength = (password: string) => {
    if (!password) return "none";
    if (password.length < 8) return "weak";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    let strength = 1;
    if (hasUpperCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;

    if (strength <= 1) return "weak";
    if (strength === 2) return "fair";
    if (strength === 3) return "good";
    return "strong";
  };

  // Handle Form Submission
  const onSubmit = (data: ExperimentFormData) => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
    console.log("Form Data:", data);
  };

  // --- Experiment 3: Full-Stack Todo CRUD ---
  const [todos, setTodos] = useState<{ _id: string; title: string; completed: boolean }[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [todoLoading, setTodoLoading] = useState(false);
  const [todoError, setTodoError] = useState("");

  const API = "http://localhost:5000/api/v1/todos";
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });

  const fetchTodos = async () => {
    setTodoLoading(true);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      if (res.ok) setTodos((await res.json()).todos);
    } catch { /* ignore */ } finally {
      setTodoLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    setTodoError("");
    const res = await fetch(API, { method: "POST", headers: authHeaders(), body: JSON.stringify({ title: newTodoTitle }) });
    if (res.ok) { setNewTodoTitle(""); fetchTodos(); }
    else setTodoError((await res.json()).message || "Failed to create todo");
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await fetch(`${API}/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ completed: !completed }) });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchTodos();
  };

  return (
    <>
      <Header />
      <div className={`experiments-container ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
        {/* Theme Toggle */}
        <div className="theme-toggle-section">
          <label htmlFor="theme-toggle" className="theme-label">
            <input
              id="theme-toggle"
              type="checkbox"
              checked={isDarkTheme}
              onChange={(e) => setIsDarkTheme(e.target.checked)}
              className="theme-checkbox"
            />
            <span className="toggle-text">
              {isDarkTheme ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </span>
          </label>
        </div>

        {/* Experiment 1: Textbox and label learning */}
        <div className="experiment-section">
          <h3 className="experiment-title">Textbox and label learning</h3>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="experiment-input"
          />
          <p className="experiment-display">
            <strong>Display:</strong> {text}
          </p>
        </div>

        {/* Experiment 2: Form Validation */}
        <div className="experiment-section">
          <h3 className="experiment-title">Form Validation</h3>
          <p className="experiment-description">
            Learn form handling, validation, and error management
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="validation-form">
            {/* First Name Field */}
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className={`form-input ${errors.firstName ? "input-error" : ""}`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="error-message">❌ {errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <span className="error-message">❌ {errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                className={`form-input ${errors.password ? "input-error" : ""}`}
                {...register("password")}
              />
              {errors.password && (
                <span className="error-message">❌ {errors.password.message}</span>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="password-strength">
                  <span className="strength-label">Strength:</span>
                  <div className={`strength-bar strength-${getPasswordStrength(password)}`}></div>
                  <span className={`strength-text strength-${getPasswordStrength(password)}`}>
                    {getPasswordStrength(password).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="error-message">❌ {errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              Submit
            </button>

            {submitted && (
              <div className="success-alert">
                ✅ Form submitted successfully!
              </div>
            )}
          </form>


          {/* Form Data Display */}
          <div className="form-info">
            <h4>Form State: (Uses React Hook Form with Zod validation)</h4>
            <p>Open browser console to see submitted data</p>
          </div>
        </div>

        {/* Experiment 3: Full-Stack Todo CRUD */}
        <div className="experiment-section">
          <h3 className="experiment-title">Todo CRUD</h3>
          <p className="experiment-description">
            Create, read, update, and delete todos — demonstrates the full MERN stack (React → Fetch API → Express → MongoDB)
          </p>

          <div className="todo-container">
            <div className="todo-input-row">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Enter a new todo..."
                className="todo-input"
              />
              <button onClick={addTodo} className="todo-add-btn">Add</button>
            </div>
            {todoError && <p className="todo-error">{todoError}</p>}

            {todoLoading ? (
              <p className="todo-loading">Loading todos...</p>
            ) : todos.length === 0 ? (
              <p className="todo-empty">No todos yet. Add one above!</p>
            ) : (
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li key={todo._id} className={`todo-item ${todo.completed ? "todo-completed" : ""}`}>
                    <span className="todo-text" onClick={() => toggleTodo(todo._id, todo.completed)}>
                      {todo.completed ? "✅" : "⬜"} {todo.title}
                    </span>
                    <button onClick={() => deleteTodo(todo._id)} className="todo-delete-btn" title="Delete">🗑️</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </>
  );
}