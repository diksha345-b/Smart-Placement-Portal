import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/common/PageHeader';
import DashboardCard from '../../components/cards/DashboardCard';
import ResumeScoreCard from '../../components/cards/ResumeScoreCard';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { resumeService } from '../../services/resumeService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { statusBadgeClass, formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      resumeService.getScore().then((d) => d.resume).catch(() => null),
      applicationService.mine().then((d) => d.applications).catch(() => []),
    ])
      .then(([r, apps]) => {
        setResume(r);
        setApplications(apps);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const underReview = applications.filter((a) => a.status === 'Under Review').length;

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0] || 'Student'}`} subtitle="Here's your placement activity at a glance." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Resume Score" value={resume ? resume.score : '—'} helper={resume ? 'out of 100' : 'Upload to score'} />
        <DashboardCard label="Applications" value={applications.length} accent="primary" />
        <DashboardCard label="Shortlisted" value={shortlisted} accent="green" />
        <DashboardCard label="Under Review" value={underReview} accent="yellow" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="surface-panel">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Resume analysis</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Keep your profile ready</h2>
              </div>
              <Link to="/student/resume" className="btn btn-primary btn-sm">
                Manage resume
              </Link>
            </div>
            <ResumeScoreCard resume={resume} />
          </div>
        </div>

        <div className="surface-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Recent applications</p>
              <p className="mt-1 text-sm text-slate-500">Track your latest job activity.</p>
            </div>
            <Link to="/student/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              message="Browse open jobs and apply to get started."
              action={<Link to="/student/jobs" className="btn btn-primary btn-sm">Browse jobs</Link>}
            />
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 4).map((app) => (
                <div key={app._id} className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{app.job?.title || 'Job removed'}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {app.job?.company} · Applied {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                      <p className="text-xs text-slate-500">Match {app.matchScore}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
