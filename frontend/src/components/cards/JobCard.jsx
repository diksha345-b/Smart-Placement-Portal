import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import SkillTags from './SkillTags';
import { statusBadgeClass } from '../../utils/helpers';

/**
 * Job listing card used in the student's job browse view.
 */
const JobCard = ({ job, to }) => {
  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} · {job.location}
          </p>
        </div>
        <span className={`badge ${statusBadgeClass(job.status)}`}>{job.status}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
        <Badge color="blue">{job.jobType}</Badge>
        {job.experienceLevel && <Badge color="gray">{job.experienceLevel}</Badge>}
        {job.salaryRange && <Badge color="gray">{job.salaryRange}</Badge>}
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-gray-600">{job.description}</p>

      {job.requiredSkills?.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-gray-400">Required skills</p>
          <SkillTags skills={job.requiredSkills} variant="primary" max={5} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={to} className="btn btn-primary btn-sm">
          View &amp; Apply
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
