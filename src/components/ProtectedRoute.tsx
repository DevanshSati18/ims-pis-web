import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded: any = jwtDecode(token);
    if (decoded.role !== "ADMIN") return <Navigate to="/" />;
    return <>{children}</>;
  } catch {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
