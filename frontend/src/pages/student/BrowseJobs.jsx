import { useEffect, useRef, useState } from 'react';

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
  const prevFilterRef = useRef({ search: '', jobType: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await jobService.list({
          search: debouncedSearch,
          jobType,
          status: 'Open',
          page,
          limit: 9,
        });
        setJobs(data.jobs);
        setPagination(data.pagination);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    const filtersChanged =
      prevFilterRef.current.search !== debouncedSearch ||
      prevFilterRef.current.jobType !== jobType;

    if (filtersChanged && page !== 1) {
      prevFilterRef.current = { search: debouncedSearch, jobType };
      setPage(1);
      return;
    }

    prevFilterRef.current = { search: debouncedSearch, jobType };
    fetchJobs();
  }, [debouncedSearch, jobType, page]);

  return (
    <div>
      <PageHeader title="Browse Jobs" subtitle="Find roles that match your skills and apply." />

      <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/50">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">Find your next role</p>
            <p className="mt-2 text-sm text-slate-500">Browse open positions and filter by role, company, or skills.</p>
          </div>
          <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
            Open jobs only
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            placeholder="Search by title, company, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="lg:col-span-2"
          />
          <Select
            placeholder="All job types"
            options={JOB_TYPES}
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
        </div>
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
