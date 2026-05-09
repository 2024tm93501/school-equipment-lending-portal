import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/common/StatCard";
import Spinner from "../components/common/Spinner";

const icons = {
  equipment: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  available: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  pending: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  active: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  users: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-24" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}</h1>
        <p className="text-gray-500 mt-1">Here's an overview of the equipment portal.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Total Equipment" value={stats?.total_equipment} icon={icons.equipment} color="indigo" />
        <StatCard title="Available Now" value={stats?.available_equipment} icon={icons.available} color="green" />
        <StatCard title="Pending Requests" value={stats?.pending_requests} icon={icons.pending} color="yellow" />
        <StatCard title="Active Borrows" value={stats?.active_borrows} icon={icons.active} color="blue" />
        {user?.role === "admin" && (
          <StatCard title="Total Users" value={stats?.total_users} icon={icons.users} color="purple" />
        )}
        {user?.role !== "admin" && (
          <>
            <StatCard title="My Pending" value={stats?.my_pending} icon={icons.pending} color="yellow" description="Your pending requests" />
            <StatCard title="My Active Borrows" value={stats?.my_active_borrows} icon={icons.active} color="blue" description="Items you're borrowing" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink to="/equipment" title="Browse Equipment" desc="Search and request equipment to borrow" color="indigo" />
        {user?.role !== "admin" && <QuickLink to="/my-requests" title="My Requests" desc="Track your borrow request status" color="blue" />}
        {user?.role === "admin" && <QuickLink to="/admin/requests" title="Manage Requests" desc="Approve or reject borrow requests" color="green" />}
        {user?.role === "admin" && <QuickLink to="/admin/equipment" title="Manage Equipment" desc="Add, edit, or remove equipment" color="purple" />}
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc, color }) {
  const colors = { indigo: "border-indigo-200 hover:border-indigo-400 bg-indigo-50", blue: "border-blue-200 hover:border-blue-400 bg-blue-50", green: "border-green-200 hover:border-green-400 bg-green-50", purple: "border-purple-200 hover:border-purple-400 bg-purple-50" };
  return (
    <Link to={to} className={`rounded-xl border-2 p-5 transition-colors ${colors[color]}`}>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
    </Link>
  );
}
