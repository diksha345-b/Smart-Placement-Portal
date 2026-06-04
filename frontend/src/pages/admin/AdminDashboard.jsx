import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .analytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;
  if (!data) return <EmptyState title="No data" message="Analytics are unavailable right now." />;

  const { stats, recentApplications } = data;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="A modern overview of platform activity." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Total Users" value={stats.totalUsers} accent="primary" helper={`${stats.totalStudents} students · ${stats.totalHR} recruiters`} />
        <DashboardCard label="Total Jobs" value={stats.totalJobs} accent="green" helper={`${stats.openJobs} open`} />
        <DashboardCard label="Applications" value={stats.totalApplications} accent="yellow" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Link to="/admin/users" className="surface-panel transition duration-200 hover:-translate-y-1 hover:border-primary-300">
          <p className="text-sm font-semibold text-slate-900">Manage Users</p>
          <p className="mt-2 text-xs text-slate-500">Activate, deactivate, or remove accounts.</p>
        </Link>
        <Link to="/admin/jobs" className="surface-panel transition duration-200 hover:-translate-y-1 hover:border-primary-300">
          <p className="text-sm font-semibold text-slate-900">Manage Jobs</p>
          <p className="mt-2 text-xs text-slate-500">Review and remove any job post.</p>
        </Link>
        <Link to="/admin/analytics" className="surface-panel transition duration-200 hover:-translate-y-1 hover:border-primary-300">
          <p className="text-sm font-semibold text-slate-900">View Analytics</p>
          <p className="mt-2 text-xs text-slate-500">Charts and platform-wide metrics.</p>
        </Link>
      </div>

      <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Recent applications</p>
            <p className="mt-1 text-sm text-slate-500">Latest activity from across the platform.</p>
          </div>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {recentApplications?.length || 0} records
          </span>
        </div>
        {(!recentApplications || recentApplications.length === 0) ? (
          <EmptyState title="No applications yet" />
        ) : (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app._id} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{app.student?.name || 'Unknown'}</p>
                    <p className="mt-1 text-sm text-slate-500">applied to {app.job?.title || 'a job'}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(app.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
