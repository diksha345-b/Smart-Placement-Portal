import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  Shortlisted: '#22c55e',
  'Under Review': '#eab308',
  Rejected: '#ef4444',
};
const BAR_COLOR = '#4f46e5';

const Analytics = () => {
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
  if (!data) return <EmptyState title="No analytics" message="Data is unavailable right now." />;

  const { stats, statusData, jobTypeData } = data;
  const hasStatus = statusData.some((s) => s.value > 0);
  const hasJobTypes = jobTypeData.length > 0;

  return (
    <div>
      <PageHeader title="Platform Analytics" subtitle="Key metrics across users, jobs, and applications." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard label="Total Users" value={stats.totalUsers} accent="primary" />
        <DashboardCard label="Students" value={stats.totalStudents} accent="primary" />
        <DashboardCard label="Recruiters" value={stats.totalHR} accent="green" />
        <DashboardCard label="Total Jobs" value={stats.totalJobs} accent="green" />
        <DashboardCard label="Open Jobs" value={stats.openJobs} accent="yellow" />
        <DashboardCard label="Applications" value={stats.totalApplications} accent="yellow" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Applications by status</h3>
          {hasStatus ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">No application data yet.</p>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Jobs by type</h3>
          {hasJobTypes ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={jobTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">No job data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
