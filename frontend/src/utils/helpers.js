// Small presentation helpers shared across components.

/**
 * Map an application status to a badge color class.
 */
export const statusBadgeClass = (status) => {
  switch (status) {
    case 'Shortlisted':
      return 'badge-green';
    case 'Under Review':
      return 'badge-yellow';
    case 'Rejected':
      return 'badge-red';
    case 'Open':
      return 'badge-green';
    case 'Closed':
      return 'badge-gray';
    default:
      return 'badge-gray';
  }
};

/**
 * Color for a numeric score (0-100).
 */
export const scoreColor = (score) => {
  if (score >= 71) return 'text-green-600';
  if (score >= 41) return 'text-yellow-600';
  return 'text-red-600';
};

export const scoreBarColor = (score) => {
  if (score >= 71) return 'bg-green-500';
  if (score >= 41) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * Format an ISO date string as a short readable date.
 */
export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Get the human-readable error message from an axios error.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};
