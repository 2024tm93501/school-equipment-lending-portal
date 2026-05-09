import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";

export default function RequestCard({ req }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{req.equipment_name}</h3>
          <p className="text-sm text-gray-500">Qty: {req.quantity_requested}</p>
        </div>
        <Badge label={req.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div><span className="font-medium">Requested:</span> {formatDate(req.requested_at)}</div>
        <div><span className="font-medium">Due:</span> {formatDate(req.due_date)}</div>
        {req.approved_at && <div><span className="font-medium">Approved:</span> {formatDate(req.approved_at)}</div>}
        {req.returned_at && <div><span className="font-medium">Returned:</span> {formatDate(req.returned_at)}</div>}
      </div>
      {req.reason && <p className="mt-2 text-xs text-gray-500 italic">"{req.reason}"</p>}
      {req.admin_note && (
        <p className="mt-2 rounded bg-yellow-50 px-3 py-1.5 text-xs text-yellow-800">
          Note: {req.admin_note}
        </p>
      )}
    </div>
  );
}
