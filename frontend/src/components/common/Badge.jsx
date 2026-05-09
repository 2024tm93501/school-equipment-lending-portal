const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-700",
  admin: "bg-purple-100 text-purple-800",
  staff: "bg-blue-100 text-blue-800",
  student: "bg-teal-100 text-teal-800",
  excellent: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-yellow-100 text-yellow-800",
  poor: "bg-red-100 text-red-800",
};

export default function Badge({ label, className = "" }) {
  const style = statusStyles[label?.toLowerCase()] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style} ${className}`}>
      {label}
    </span>
  );
}
