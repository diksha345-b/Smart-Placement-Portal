import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import SkillTags from '../../components/cards/SkillTags';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { statusBadgeClass, formatDate, getErrorMessage } from '../../utils/helpers';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobService
      .get(id)
      .then((data) => {
        setJob(data.job);
        setHasApplied(data.hasApplied);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err, 'Job not found'));
        navigate('/student/jobs');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const hasSkills = (user?.skills || []).length > 0;

  const handleApply = async () => {
    setApplying(true);
    try {
      const { application } = await applicationService.apply(id, { coverNote });
      setHasApplied(true);
      setModalOpen(false);
      toast.success(`Application submitted — ${application.status} (${application.matchScore}% match)`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not apply'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!job) return null;

  return (
    <div>
      <Link to="/student/jobs" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
        ← Back to jobs
      </Link>

      <PageHeader
        title={job.title}
        subtitle={`${job.company} · ${job.location}`}
        actions={
          hasApplied ? (
            <Badge color="green">Applied</Badge>
          ) : job.status === 'Closed' ? (
            <Badge color="gray">Closed</Badge>
          ) : (
            <Button onClick={() => setModalOpen(true)}>Apply now</Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900">Job description</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {job.description}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900">Required skills</h3>
            <div className="mt-3">
              <SkillTags skills={job.requiredSkills} variant="primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="card space-y-3 text-sm">
            <Detail label="Job type" value={job.jobType} />
            <Detail label="Location" value={job.location} />
            {job.experienceLevel && <Detail label="Experience" value={job.experienceLevel} />}
            {job.salaryRange && <Detail label="Salary" value={job.salaryRange} />}
            <Detail
              label="Status"
              value={<span className={`badge ${statusBadgeClass(job.status)}`}>{job.status}</span>}
            />
            <Detail label="Posted" value={formatDate(job.createdAt)} />
          </div>

          {!hasSkills && !hasApplied && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-700">
              Add skills to your profile or upload a resume so we can match you to this role.
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Apply to ${job.title}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} loading={applying}>
              Submit application
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Your application will be auto-matched against the required skills and assigned a status.
        </p>
        <div className="mt-4">
          <Textarea
            label="Cover note (optional)"
            rows={4}
            placeholder="Briefly tell the recruiter why you're a good fit."
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default JobDetail;
