import { useState, useEffect } from "react";
import { getAllRequests, approveRequest, rejectRequest, returnRequest } from "../api/requestsApi";
import RequestTable from "../components/requests/RequestTable";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { REQUEST_STATUS } from "../utils/constants";

const TABS = ["all", ...Object.values(REQUEST_STATUS)];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [actionTarget, setActionTarget] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [acting, setActing] = useState(false);

  const fetch = () => {
    setLoading(true);
    getAllRequests({ status: activeTab !== "all" ? activeTab : undefined, search: search || undefined })
      .then((r) => { setRequests(r.data.requests); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [activeTab, search]);

  const doAction = async () => {
    if (!actionTarget) return;
    setActing(true);
    try {
      if (actionTarget.action === "approve") await approveRequest(actionTarget.req.id, adminNote);
      else if (actionTarget.action === "reject") await rejectRequest(actionTarget.req.id, adminNote);
      else if (actionTarget.action === "return") await returnRequest(actionTarget.req.id);
      setActionTarget(null);
      setAdminNote("");
      fetch();
    } catch (err) {
      alert(err.response?.data?.detail || "Action failed.");
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{total} request{total !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              {tab}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by user or equipment..." className="sm:w-64" />
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests" description="No borrow requests match the current filter." />
      ) : (
        <RequestTable
          requests={requests}
          onApprove={(req) => setActionTarget({ req, action: "approve" })}
          onReject={(req) => setActionTarget({ req, action: "reject" })}
          onReturn={(req) => setActionTarget({ req, action: "return" })}
        />
      )}

      <Modal
        isOpen={!!actionTarget}
        onClose={() => { setActionTarget(null); setAdminNote(""); }}
        title={actionTarget?.action === "return" ? "Confirm Return" : `${actionTarget?.action === "approve" ? "Approve" : "Reject"} Request`}
        maxWidth="max-w-md"
      >
        {actionTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <strong>{actionTarget.action === "return" ? "Mark as returned:" : actionTarget.action === "approve" ? "Approve request for:" : "Reject request for:"}</strong>{" "}
              {actionTarget.req.equipment_name} — {actionTarget.req.user_name}
            </p>
            {actionTarget.action !== "return" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Note {actionTarget.action === "reject" ? "(reason for rejection)" : "(optional)"}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  className="input mt-1"
                  placeholder={actionTarget.action === "reject" ? "Explain why..." : "Optional note..."}
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setActionTarget(null); setAdminNote(""); }}>Cancel</Button>
              <Button
                variant={actionTarget.action === "reject" ? "danger" : actionTarget.action === "approve" ? "success" : "secondary"}
                loading={acting}
                onClick={doAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
