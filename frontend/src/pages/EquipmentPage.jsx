import { useState, useEffect, useCallback } from "react";
import { getEquipment } from "../api/equipmentApi";
import { submitRequest } from "../api/requestsApi";
import EquipmentCard from "../components/equipment/EquipmentCard";
import BorrowModal from "../components/requests/BorrowModal";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import { CATEGORIES } from "../utils/constants";

export default function EquipmentPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [borrowTarget, setBorrowTarget] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchEquipment = useCallback(() => {
    setLoading(true);
    getEquipment({ search, category: category || undefined, available_only: availableOnly || undefined })
      .then((r) => { setItems(r.data.equipment); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, availableOnly]);

  useEffect(() => { fetchEquipment(); }, [fetchEquipment]);

  const handleBorrow = async (reqData) => {
    setBorrowLoading(true);
    try {
      await submitRequest(reqData);
      setSuccessMsg("Request submitted successfully!");
      setBorrowTarget(null);
      fetchEquipment();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit request.");
    } finally {
      setBorrowLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-500 text-sm mt-1">{total} item{total !== 1 ? "s" : ""} available</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{successMsg}</div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search equipment..." className="flex-1" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600"
          />
          Available only
        </label>
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : items.length === 0 ? (
        <EmptyState title="No equipment found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <EquipmentCard key={item.id} item={item} onBorrow={setBorrowTarget} />
          ))}
        </div>
      )}

      <BorrowModal
        equipment={borrowTarget}
        onClose={() => setBorrowTarget(null)}
        onSubmit={handleBorrow}
        loading={borrowLoading}
      />
    </div>
  );
}
