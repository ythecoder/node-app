import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { registerSchema } from "../validators/authSchemas";
import type { RegisterFormData } from "../validators/authSchemas";
import "./Auth.css";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Show errors in real-time
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");

      toast.success("Registration successful!");
      localStorage.setItem("token", result.token);
      window.location.href = "/";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Sign up to get started with our platform.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="auth-input-wrapper">
              <label>First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>
            
            <div className="auth-input-wrapper">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>
          
          <div className="auth-input-wrapper">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          
          <div className="auth-input-wrapper">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          
          <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <div className="auth-spinner"></div> : <span>Register Now</span>}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Sign in</a>
        </div>
      </div>
    </div>
  );
}
