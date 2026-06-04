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

      <div className="grid gap-5 sm:grid-cols-3">
        <DashboardCard label="Total Jobs" value={jobs.length} accent="primary" />
        <DashboardCard label="Open Jobs" value={openJobs} accent="green" />
        <DashboardCard label="Total Applicants" value={totalApplicants} accent="yellow" />
      </div>

      <div className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Your recent jobs</p>
            <p className="mt-1 text-sm text-slate-500">Quickly review your latest job postings.</p>
          </div>
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
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-200/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{job.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.location} · Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`badge ${statusBadgeClass(job.status)}`}>{job.status}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {job.applicantCount || 0} applicants
                    </span>
                    <Link to={`/hr/jobs/${job._id}/applicants`} className="btn btn-secondary btn-sm">
                      View applicants
                    </Link>
                  </div>
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
