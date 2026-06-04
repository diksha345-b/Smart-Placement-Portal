import { useEffect, useState } from 'react';

import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import JobCard from '../../components/cards/JobCard';
import { jobService } from '../../services/jobService';
import { useDebounce } from '../../hooks/useDebounce';
import { JOB_TYPES } from '../../utils/constants';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setLoading(true);
    jobService
      .list({ search: debouncedSearch, jobType, status: 'Open', page, limit: 9 })
      .then((data) => {
        setJobs(data.jobs);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [debouncedSearch, jobType, page]);

  // Reset to page 1 whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, jobType]);

  return (
    <div>
      <PageHeader title="Browse Jobs" subtitle="Find roles that match your skills and apply." />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search by title, company, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:col-span-2"
        />
        <Select
          placeholder="All job types"
          options={JOB_TYPES}
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} to={`/student/jobs/${job._id}`} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default BrowseJobs;
