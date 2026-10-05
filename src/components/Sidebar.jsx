import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/storage";
const links = { client: [["/client", "Overview"], ["/client/post-project", "Post Project"], ["/client/projects", "My Projects"], ["/client/proposals", "Proposals"]], freelancer: [["/freelancer", "Overview"], ["/freelancer/projects", "Browse Projects"], ["/freelancer/proposals", "My Proposals"], ["/freelancer/profile", "My Profile"]] };
function Sidebar({ role, user }) { const navigate = useNavigate(); const items = role === "admin" ? [["/admin", "Dashboard"]] : links[role]; return <aside className="sidebar"><Link className="brand" to="/">FreelanceHub</Link><p className="role-label">{role} portal</p><nav>{items.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav><div className="sidebar-bottom"><strong>{user.name}</strong><button className="text-button" onClick={() => { logout(); navigate("/login"); }}>Logout</button></div></aside>; }
export default Sidebar;
