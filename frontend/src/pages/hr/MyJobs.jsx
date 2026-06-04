import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { jobService } from '../../services/jobService';
import { statusBadgeClass, formatDate, getErrorMessage } from '../../utils/helpers';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    jobService
      .myJobs()
      .then((data) => setJobs(data.jobs))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jobService.remove(deleteTarget._id);
      toast.success('Job deleted');
      setDeleteTarget(null);
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.jobType} · {row.location}</p>
        </div>
      ),
    },
    {
      key: 'applicantCount',
      header: 'Applicants',
      render: (row) => <span className="text-gray-700">{row.applicantCount || 0}</span>,
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
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/hr/jobs/${row._id}/applicants`)}>
            Applicants
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/hr/jobs/${row._id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Jobs"
        subtitle="Edit, delete, and review applicants for your posts."
        actions={
          <Link to="/hr/jobs/new" className="btn btn-primary btn-sm">
            Post a job
          </Link>
        }
      />

      <Table
        columns={columns}
        data={jobs}
        loading={loading}
        emptyMessage="You haven't posted any jobs yet."
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete job"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">{deleteTarget?.title}</span>? This will also
          remove all related applications. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MyJobs;
