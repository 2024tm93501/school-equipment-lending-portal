import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

export default function BorrowModal({ equipment, onClose, onSubmit, loading }) {
  const max = equipment?.available_qty || 1;
  const [qty, setQty] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [reason, setReason] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ equipment_id: equipment.id, quantity_requested: qty, due_date: dueDate, reason });
  };

  return (
    <Modal isOpen={!!equipment} onClose={onClose} title={`Borrow: ${equipment?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500">
          Available: <span className="font-semibold text-green-600">{max}</span> unit(s)
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity *</label>
          <input
            type="number" min={1} max={max} required
            value={qty} onChange={(e) => setQty(Number(e.target.value))}
            className="input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Return By *</label>
          <input
            type="date" required min={minDateStr}
            value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reason (optional)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="input mt-1" placeholder="Purpose of borrowing..." />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Submit Request</Button>
        </div>
      </form>
    </Modal>
  );
}
