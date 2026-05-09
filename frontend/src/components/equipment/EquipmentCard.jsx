import Badge from "../common/Badge";
import Button from "../common/Button";

export default function EquipmentCard({ item, onBorrow }) {
  const available = item.available_qty > 0;
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 leading-snug">{item.name}</h3>
          <Badge label={item.condition} />
        </div>
        {item.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-2.5 py-1">{item.category}</span>
          <span className={`rounded-full px-2.5 py-1 ${available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {item.available_qty} / {item.total_quantity} available
          </span>
        </div>
      </div>
      <div className="border-t border-gray-100 p-4">
        <Button
          onClick={() => onBorrow(item)}
          disabled={!available}
          variant={available ? "primary" : "secondary"}
          className="w-full"
          size="sm"
        >
          {available ? "Request to Borrow" : "Not Available"}
        </Button>
      </div>
    </div>
  );
}
