/**
 * Spinner loader. `fullPage` centers it in a tall container for route-level
 * loading states; otherwise it renders inline.
 */
const Loader = ({ fullPage = false, label = 'Loading...' }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-gray-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>;
  }
  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Loader;
