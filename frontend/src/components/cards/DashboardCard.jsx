/**
 * Stat card for dashboards. Shows a label, a large value, and an optional
 * icon and helper text. Intentionally flat (border, no heavy shadow).
 */
const DashboardCard = ({ label, value, icon, helper, accent = 'primary' }) => {
  const accentClass =
    accent === 'green'
      ? 'bg-green-50 text-green-600'
      : accent === 'yellow'
      ? 'bg-yellow-50 text-yellow-600'
      : accent === 'red'
      ? 'bg-red-50 text-red-600'
      : 'bg-primary-50 text-primary-600';

  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {helper && <p className="mt-1 text-xs text-gray-400">{helper}</p>}
      </div>
      {icon && (
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accentClass}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
