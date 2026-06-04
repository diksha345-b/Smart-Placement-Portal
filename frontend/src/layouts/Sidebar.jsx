import { NavLink } from 'react-router-dom';
import { NAV_BY_ROLE } from './navConfig';

/**
 * Role-aware sidebar. On mobile it slides in via the `open` prop controlled
 * by the layout's top bar.
 */
const Sidebar = ({ role, open, onClose }) => {
  const items = NAV_BY_ROLE[role] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 text-slate-100 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 bg-slate-900 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-lg font-bold text-white shadow-md shadow-primary-500/20">
            P
          </div>
          <span className="text-sm font-semibold text-white">Placement Portal</span>
        </div>

        <nav className="space-y-1 p-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500 shadow-sm shadow-primary-500/10'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
