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
      <PageHeader title="Admin Dashboard" subtitle="Overview of platform activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Total Users" value={stats.totalUsers} accent="primary" helper={`${stats.totalStudents} students · ${stats.totalHR} recruiters`} />
        <DashboardCard label="Total Jobs" value={stats.totalJobs} accent="green" helper={`${stats.openJobs} open`} />
        <DashboardCard label="Applications" value={stats.totalApplications} accent="yellow" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/admin/users" className="card transition-colors hover:border-primary-300">
          <p className="text-sm font-semibold text-gray-900">Manage Users</p>
          <p className="mt-1 text-xs text-gray-500">Activate, deactivate, or remove accounts.</p>
        </Link>
        <Link to="/admin/jobs" className="card transition-colors hover:border-primary-300">
          <p className="text-sm font-semibold text-gray-900">Manage Jobs</p>
          <p className="mt-1 text-xs text-gray-500">Review and remove any job post.</p>
        </Link>
        <Link to="/admin/analytics" className="card transition-colors hover:border-primary-300">
          <p className="text-sm font-semibold text-gray-900">View Analytics</p>
          <p className="mt-1 text-xs text-gray-500">Charts and platform-wide metrics.</p>
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Recent applications</h2>
        {(!recentApplications || recentApplications.length === 0) ? (
          <EmptyState title="No applications yet" />
        ) : (
          <div className="space-y-2">
            {recentApplications.map((app) => (
              <div key={app._id} className="card flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.student?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">applied to {app.job?.title || 'a job'}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(app.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
