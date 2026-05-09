import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../common/Badge";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {user?.role === "admin" && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-bold text-indigo-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="hidden sm:block">Equipment Portal</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/equipment">Equipment</NavLink>
          {user?.role !== "admin" && <NavLink to="/my-requests">My Requests</NavLink>}
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin/equipment">Manage Equipment</NavLink>
              <NavLink to="/admin/requests">Requests</NavLink>
              <NavLink to="/admin/users">Users</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-gray-600">{user.full_name}</span>
              <Badge label={user.role} />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}
