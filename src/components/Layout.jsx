import Sidebar from "./Sidebar";
import { getCurrentUser } from "../utils/storage";
function Layout({ children }) { const user = getCurrentUser(); return <div className="dashboard-layout"><Sidebar role={user.role} user={user} /><main className="dashboard-main">{children}</main></div>; }
export default Layout;
