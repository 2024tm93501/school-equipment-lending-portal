import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatDate } from "../../utils/formatters";

export default function RequestTable({ requests, onApprove, onReject, onReturn }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Equipment</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Due</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{req.equipment_name}</td>
              <td className="px-4 py-3 text-gray-600">{req.user_name}</td>
              <td className="px-4 py-3 text-gray-600">{req.quantity_requested}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(req.due_date)}</td>
              <td className="px-4 py-3"><Badge label={req.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {req.status === "pending" && (
                    <>
                      <Button size="sm" variant="success" onClick={() => onApprove(req)}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => onReject(req)}>Reject</Button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <Button size="sm" variant="secondary" onClick={() => onReturn(req)}>Mark Returned</Button>
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
