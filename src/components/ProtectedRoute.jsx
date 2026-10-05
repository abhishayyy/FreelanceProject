import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/storage";
function ProtectedRoute({ role, children }) { const user = getCurrentUser(); if (!user) return <Navigate to="/login" replace />; if (user.role !== role) return <Navigate to={`/${user.role}`} replace />; return children; }
export default ProtectedRoute;
