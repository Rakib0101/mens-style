"use client";

const STATUSES = ["pending", "confirmed", "delivered", "cancelled"];

export default function OrderStatusSelect({
  status,
  action,
}: {
  status: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-surface-line px-2.5 py-1.5 text-xs font-medium capitalize outline-none focus:border-ink"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
