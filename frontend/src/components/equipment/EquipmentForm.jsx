import { useState } from "react";
import Button from "../common/Button";
import { CATEGORIES, CONDITIONS } from "../../utils/constants";

export default function EquipmentForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    category: initial.category || CATEGORIES[0],
    total_quantity: initial.total_quantity || 1,
    condition: initial.condition || "good",
    image_url: initial.image_url || "",
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, total_quantity: Number(form.total_quantity) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input required value={form.name} onChange={set("name")} className="input mt-1" placeholder="e.g. DSLR Camera" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={form.description} onChange={set("description")} rows={2} className="input mt-1" placeholder="Brief description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select required value={form.category} onChange={set("category")} className="input mt-1">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Condition *</label>
          <select value={form.condition} onChange={set("condition")} className="input mt-1">
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Quantity *</label>
        <input required type="number" min={1} value={form.total_quantity} onChange={set("total_quantity")} className="input mt-1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input value={form.image_url} onChange={set("image_url")} className="input mt-1" placeholder="https://..." />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial.id ? "Update" : "Add Equipment"}</Button>
      </div>
    </form>
  );
}
