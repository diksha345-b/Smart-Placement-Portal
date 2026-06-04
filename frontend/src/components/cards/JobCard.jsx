import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import SkillTags from './SkillTags';
import { statusBadgeClass } from '../../utils/helpers';

/**
 * Job listing card used in the student's job browse view.
 */
const JobCard = ({ job, to }) => {
  return (
    <div className="card group flex h-full flex-col overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-sky-400 to-cyan-400" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600">{job.title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {(job.company || job.postedBy?.company) ?? 'Company not specified'} · {job.location}
            </p>
          </div>
          <span className={`badge ${statusBadgeClass(job.status)}`}>{job.status}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge color="blue">{job.jobType}</Badge>
          {job.experienceLevel && <Badge color="gray">{job.experienceLevel}</Badge>}
          {job.salaryRange && <Badge color="gray">{job.salaryRange}</Badge>}
        </div>

        <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{job.description}</p>

        {job.requiredSkills?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Required skills</p>
            <SkillTags skills={job.requiredSkills} variant="primary" max={5} />
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-400">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>
          <Link to={to} className="btn btn-primary btn-sm">
            View &amp; Apply
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
