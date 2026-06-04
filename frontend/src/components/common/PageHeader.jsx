/**
 * Consistent page title block with an optional action area on the right.
 */
const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
