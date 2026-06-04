import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SkillTags from '../../components/cards/SkillTags';
import Modal from '../../components/common/Modal';
import { applicationService } from '../../services/applicationService';
import { statusBadgeClass, scoreColor, formatDate, getErrorMessage } from '../../utils/helpers';

const STATUS_FILTERS = ['All', 'Shortlisted', 'Under Review', 'Rejected'];

const Applicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = () => {
    setLoading(true);
    applicationService
      .forJob(id)
      .then((data) => {
        setJob(data.job);
        setApplications(data.applications);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (appId, status) => {
    setUpdatingId(appId);
    try {
      const { application } = await applicationService.updateStatus(appId, status);
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status: application.status } : a)));
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader fullPage />;

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter);

  return (
    <div>
      <Link to="/hr/jobs" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
        ← Back to my jobs
      </Link>

      <PageHeader
        title="Applicants"
        subtitle={job ? `For: ${job.title} · ${applications.length} applicant(s)` : ''}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No applicants" message="No applications match this filter yet." />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const student = app.student || {};
            return (
              <div key={app._id} className="card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-gray-900">{student.name || 'Unknown'}</p>
                      <span className={`badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {student.email}
                      {student.college ? ` · ${student.college}` : ''}
                      {student.degree ? ` · ${student.degree}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Applied {formatDate(app.createdAt)}</p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Matched skills</p>
                        <div className="mt-1">
                          <SkillTags skills={app.matchedSkills} variant="matched" max={6} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Missing skills</p>
                        <div className="mt-1">
                          <SkillTags skills={app.missingSkills} variant="missing" max={6} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="text-right">
                      <p className={`text-2xl font-semibold ${scoreColor(app.matchScore)}`}>{app.matchScore}%</p>
                      <p className="text-xs text-gray-400">match score</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDetail(app)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant={app.status === 'Shortlisted' ? 'primary' : 'secondary'}
                        loading={updatingId === app._id}
                        onClick={() => updateStatus(app._id, 'Shortlisted')}
                      >
                        Shortlist
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={updatingId === app._id}
                        onClick={() => updateStatus(app._id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title="Applicant details" size="lg">
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Name" value={detail.student?.name} />
            <Row label="Email" value={detail.student?.email} />
            <Row label="Phone" value={detail.student?.phone || '—'} />
            <Row label="College" value={detail.student?.college || '—'} />
            <Row label="Degree" value={detail.student?.degree || '—'} />
            <Row label="Graduation year" value={detail.student?.graduationYear || '—'} />
            <Row label="Resume score" value={detail.student?.resume?.score ?? '—'} />
            <Row label="Match score" value={`${detail.matchScore}%`} />
            <Row label="Status" value={<span className={`badge ${statusBadgeClass(detail.status)}`}>{detail.status}</span>} />
            <div>
              <p className="text-xs font-medium text-gray-500">Candidate skills</p>
              <div className="mt-1">
                <SkillTags skills={detail.candidateSkills} variant="primary" />
              </div>
            </div>
            {detail.coverNote && (
              <div>
                <p className="text-xs font-medium text-gray-500">Cover note</p>
                <p className="mt-1 whitespace-pre-line text-gray-700">{detail.coverNote}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 pb-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default Applicants;
