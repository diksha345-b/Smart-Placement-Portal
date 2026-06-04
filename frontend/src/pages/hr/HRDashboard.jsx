import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';
import { statusBadgeClass, formatDate } from '../../utils/helpers';

const HRDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService
      .myJobs()
      .then((data) => setJobs(data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  const openJobs = jobs.filter((j) => j.status === 'Open').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0] || 'Recruiter'}`}
        subtitle="Manage your job posts and review applicants."
        actions={
          <Link to="/hr/jobs/new" className="btn btn-primary btn-sm">
            Post a job
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard label="Total Jobs" value={jobs.length} accent="primary" />
        <DashboardCard label="Open Jobs" value={openJobs} accent="green" />
        <DashboardCard label="Total Applicants" value={totalApplicants} accent="yellow" />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Your recent jobs</h2>
          <Link to="/hr/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs posted yet"
            message="Create your first job post to start receiving applications."
            action={<Link to="/hr/jobs/new" className="btn btn-primary btn-sm">Post a job</Link>}
          />
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">
                    {job.location} · Posted {formatDate(job.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusBadgeClass(job.status)}`}>{job.status}</span>
                  <span className="text-xs text-gray-500">{job.applicantCount || 0} applicants</span>
                  <Link to={`/hr/jobs/${job._id}/applicants`} className="btn btn-secondary btn-sm">
                    View applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
