/**
 * Stat card for dashboards. Shows a label, a large value, and an optional
 * icon and helper text. Intentionally flat (border, no heavy shadow).
 */
const DashboardCard = ({ label, value, icon, helper, accent = 'primary' }) => {
  const accentClass =
    accent === 'green'
      ? 'bg-emerald-100 text-emerald-700'
      : accent === 'yellow'
      ? 'bg-amber-100 text-amber-700'
      : accent === 'red'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-gradient-to-r from-primary-500 to-cyan-400 text-white';

  return (
    <div className="surface-panel flex items-center justify-between gap-4 overflow-hidden">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
      </div>
      {icon && (
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${accentClass}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
