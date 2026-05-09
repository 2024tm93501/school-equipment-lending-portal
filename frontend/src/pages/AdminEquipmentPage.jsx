import { useState, useEffect, useCallback } from "react";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from "../api/equipmentApi";
import EquipmentTable from "../components/equipment/EquipmentTable";
import EquipmentForm from "../components/equipment/EquipmentForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";

export default function AdminEquipmentPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    getEquipment({ search, limit: 100 })
      .then((r) => { setItems(r.data.equipment); setTotal(r.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (formModal?.id) await updateEquipment(formModal.id, data);
      else await createEquipment(data);
      setFormModal(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEquipment(deleteTarget.id);
      setDeleteTarget(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Equipment</h1>
          <p className="text-gray-500 text-sm mt-1">{total} item{total !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setFormModal({})}>+ Add Equipment</Button>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search equipment..." className="max-w-sm" />
      </div>

      {loading ? (
        <Spinner className="py-24" />
      ) : items.length === 0 ? (
        <EmptyState title="No equipment" description="Add equipment to get started." action={<Button onClick={() => setFormModal({})}>Add Equipment</Button>} />
      ) : (
        <EquipmentTable items={items} onEdit={setFormModal} onDelete={setDeleteTarget} />
      )}

      <Modal isOpen={!!formModal} onClose={() => setFormModal(null)} title={formModal?.id ? "Edit Equipment" : "Add Equipment"}>
        {formModal && (
          <EquipmentForm initial={formModal} onSubmit={handleSave} onCancel={() => setFormModal(null)} loading={saving} />
        )}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Equipment" maxWidth="max-w-sm">
        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
