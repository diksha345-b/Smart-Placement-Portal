import { Outlet } from 'react-router-dom';

/**
 * Centered, two-column layout for login / register pages. The left panel is
 * a simple brand/value-prop area; on small screens only the form shows.
 */
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 font-bold">
            P
          </div>
          <span className="text-lg font-semibold">Smart Placement Portal</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-snug text-white">
            Connecting students and recruiters, intelligently.
          </h2>
          <p className="mt-4 max-w-md text-primary-100">
            Upload your resume, get an instant skills analysis, and let smart
            matching surface the roles where you fit best.
          </p>
        </div>
        <p className="text-sm text-primary-200">© {new Date().getFullYear()} Placement Portal</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
