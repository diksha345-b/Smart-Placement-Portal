import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';
import { statusBadgeClass, formatDate, getErrorMessage } from '../../utils/helpers';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminService
      .jobs({ page, limit: 10 })
      .then((data) => {
        setJobs(data.jobs);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteJob(deleteTarget._id);
      toast.success('Job deleted');
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Job',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.company} · {row.location}</p>
        </div>
      ),
    },
    {
      key: 'postedBy',
      header: 'Posted by',
      render: (row) => (
        <div className="text-xs">
          <p className="text-gray-700">{row.postedBy?.name || '—'}</p>
          <p className="text-gray-400">{row.postedBy?.email}</p>
        </div>
      ),
    },
    {
      key: 'jobType',
      header: 'Type',
      render: (row) => <span className="text-gray-600">{row.jobType}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`badge ${statusBadgeClass(row.status)}`}>{row.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Posted',
      render: (row) => <span className="text-gray-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end">
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Manage Jobs" subtitle="Review and remove job posts across the platform." />

      <Table columns={columns} data={jobs} loading={loading} emptyMessage="No jobs found." />
      <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete job"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-medium text-gray-900">{deleteTarget?.title}</span> and all its
          applications? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageJobs;
