/**
 * Small status pill. Pass an explicit `color` (green|yellow|red|gray|blue)
 * or let the parent pass a precomputed badge class via className.
 */
const COLOR_MAP = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  gray: 'badge-gray',
  blue: 'badge-blue',
};

const Badge = ({ children, color = 'gray', className = '' }) => {
  return <span className={`badge ${COLOR_MAP[color] || ''} ${className}`}>{children}</span>;
};

export default Badge;
