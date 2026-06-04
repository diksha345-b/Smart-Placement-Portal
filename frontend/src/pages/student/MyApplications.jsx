import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Badge from '../../components/common/Badge';
import { applicationService } from '../../services/applicationService';
import { statusBadgeClass, formatDate, scoreColor, getErrorMessage } from '../../utils/helpers';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService
      .mine()
      .then((data) => setApplications(data.applications))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: 'job',
      header: 'Job',
      render: (row) =>
        row.job ? (
          <div>
            <p className="font-medium text-gray-900">{row.job.title}</p>
            <p className="text-xs text-gray-500">
              {row.job.company} · {row.job.location}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">Job removed</span>
        ),
    },
    {
      key: 'matchScore',
      header: 'Match',
      render: (row) => <span className={`font-semibold ${scoreColor(row.matchScore)}`}>{row.matchScore}%</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`badge ${statusBadgeClass(row.status)}`}>{row.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Applied',
      render: (row) => <span className="text-gray-500">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle="Track the status of every job you've applied to."
        actions={
          <Link to="/student/jobs" className="btn btn-primary btn-sm">
            Browse more jobs
          </Link>
        }
      />

      <Table
        columns={columns}
        data={applications}
        loading={loading}
        emptyMessage="You haven't applied to any jobs yet."
      />
    </div>
  );
};

export default MyApplications;
