import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

interface DecodedToken {
  id: string;
  email?: string;
  name?: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  exp: number;
  iat: number;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        const decoded: DecodedToken = jwtDecode(data.token);
        console.log("User Info:", decoded);

        alert(`Login successful as ${decoded.role}!`);

        if (decoded.role === "ADMIN") {
          navigate("/dashboard");
        } else {
          alert("Access denied. Only ADMINs can access the dashboard.");
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}>
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
