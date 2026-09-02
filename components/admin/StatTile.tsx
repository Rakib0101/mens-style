export default function StatTile({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border border-surface-line bg-white p-5">
      <p className="text-xs font-semibold text-ink/50">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-ink">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-ink/40">{sublabel}</p> : null}
    </div>
  );
}
