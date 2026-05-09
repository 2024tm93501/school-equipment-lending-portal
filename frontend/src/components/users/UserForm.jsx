import { useState } from "react";
import Button from "../common/Button";
import { ROLES } from "../../utils/constants";

export default function UserForm({ user, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ full_name: user.full_name, role: user.role });
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input value={form.full_name} onChange={set("full_name")} className="input mt-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select value={form.role} onChange={set("role")} className="input mt-1">
          {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Changes</Button>
      </div>
    </form>
  );
}
