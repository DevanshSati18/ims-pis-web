"use client";

import { useAppSelector } from "@/store/hooks";

export default function InventoryPanel({
  subDepartmentKey,
}: {
  subDepartmentKey: string | null;
}) {
  const { bySubDept, loading } = useAppSelector(
    (state) => state.inventory
  );

  if (!subDepartmentKey) {
    return (
      <div className="text-gray-500">
        Select a sub-department to view inventory
      </div>
    );
  }

  if (loading) {
    return <div>Loading inventory…</div>;
  }

  const items = bySubDept[subDepartmentKey] || [];

  if (items.length === 0) {
    return <div>No inventory found.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item._id}
          className="rounded border p-3 flex justify-between"
        >
          <span className="font-medium">{item.name}</span>
          <span className="text-sm text-gray-600">
            Qty: {item.quantity}
          </span>
        </div>
      ))}
    </div>
  );
}
