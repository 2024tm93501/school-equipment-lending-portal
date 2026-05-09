import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatDate } from "../../utils/formatters";

export default function UserTable({ users, onEdit, onDeactivate, currentUserId }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
              <td className="px-4 py-3 text-gray-600">{u.email}</td>
              <td className="px-4 py-3"><Badge label={u.role} /></td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium ${u.is_active ? "text-green-600" : "text-red-500"}`}>
                  {u.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(u.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(u)}>Edit</Button>
                  {u.id !== currentUserId && (
                    <Button size="sm" variant="danger" onClick={() => onDeactivate(u)}>
                      {u.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
