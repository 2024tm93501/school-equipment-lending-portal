import Badge from "../common/Badge";
import Button from "../common/Button";

export default function EquipmentTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Available</th>
            <th className="px-4 py-3 text-left">Condition</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{item.name}</div>
                {item.description && <div className="text-xs text-gray-400 truncate max-w-xs">{item.description}</div>}
              </td>
              <td className="px-4 py-3 text-gray-600">{item.category}</td>
              <td className="px-4 py-3 text-gray-600">{item.total_quantity}</td>
              <td className="px-4 py-3">
                <span className={`font-medium ${item.available_qty > 0 ? "text-green-600" : "text-red-500"}`}>
                  {item.available_qty}
                </span>
              </td>
              <td className="px-4 py-3"><Badge label={item.condition} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(item)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
