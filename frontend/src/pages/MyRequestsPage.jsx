import { useState, useEffect } from "react";
import { getMyRequests } from "../api/requestsApi";
import RequestCard from "../components/requests/RequestCard";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { REQUEST_STATUS } from "../utils/constants";

const TABS = ["all", ...Object.values(REQUEST_STATUS)];

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    getMyRequests(activeTab !== "all" ? { status: activeTab } : {})
      .then((r) => { setRequests(r.data.requests); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{total} request{total !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-indigo-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests" description="You haven't made any borrow requests yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => <RequestCard key={req.id} req={req} />)}
        </div>
      )}
    </div>
  );
}
