import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClientDashboard from "./pages/ClientDashboard";
import PostProject from "./pages/PostProject";
import ClientProjects from "./pages/ClientProjects";
import ClientProposals from "./pages/ClientProposals";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import BrowseProjects from "./pages/BrowseProjects";
import FreelancerProposals from "./pages/FreelancerProposals";
import FreelancerProfile from "./pages/FreelancerProfile";
import AdminDashboard from "./pages/AdminDashboard";
function HomePage() { return <><Navbar /><Home /></>; }
function App() { return <BrowserRouter><Routes>
  <Route path="/" element={<HomePage />} /><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} />
  <Route path="/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} /><Route path="/client/post-project" element={<ProtectedRoute role="client"><PostProject /></ProtectedRoute>} /><Route path="/client/projects" element={<ProtectedRoute role="client"><ClientProjects /></ProtectedRoute>} /><Route path="/client/proposals" element={<ProtectedRoute role="client"><ClientProposals /></ProtectedRoute>} />
  <Route path="/freelancer" element={<ProtectedRoute role="freelancer"><FreelancerDashboard /></ProtectedRoute>} /><Route path="/freelancer/projects" element={<ProtectedRoute role="freelancer"><BrowseProjects /></ProtectedRoute>} /><Route path="/freelancer/proposals" element={<ProtectedRoute role="freelancer"><FreelancerProposals /></ProtectedRoute>} /><Route path="/freelancer/profile" element={<ProtectedRoute role="freelancer"><FreelancerProfile /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} /><Route path="*" element={<HomePage />} />
</Routes></BrowserRouter>; }
export default App;
