import { useState, useEffect } from "react";
import { getUsers, updateUser } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    getUsers({ search: search || undefined, limit: 100 })
      .then((r) => { setUsers(r.data.users); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [search]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await updateUser(editTarget.id, data);
      setEditTarget(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.detail || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (u) => {
    if (!confirm(`${u.is_active ? "Deactivate" : "Activate"} ${u.full_name}?`)) return;
    try {
      await updateUser(u.id, { is_active: !u.is_active });
      fetch();
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{total} user{total !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." className="max-w-sm" />
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No users match the search." />
      ) : (
        <UserTable users={users} onEdit={setEditTarget} onDeactivate={handleDeactivate} currentUserId={me?.id} />
      )}

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit User">
        {editTarget && (
          <UserForm user={editTarget} onSubmit={handleSave} onCancel={() => setEditTarget(null)} loading={saving} />
        )}
      </Modal>
    </div>
  );
}
