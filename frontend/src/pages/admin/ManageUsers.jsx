import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/tables/Table';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const ROLE_BADGE = { student: 'blue', hr: 'green', admin: 'gray' };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const load = () => {
    setLoading(true);
    adminService
      .users({ search: debouncedSearch, role, page, limit: 10 })
      .then((data) => {
        setUsers(data.users);
        setPagination(data.pagination);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, role, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role]);

  const handleToggle = async (user) => {
    setBusyId(user._id);
    try {
      const { user: updated } = await adminService.toggleUserStatus(user._id);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: updated.isActive } : u)));
      toast.success(`User ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget._id);
    try {
      await adminService.deleteUser(deleteTarget._id);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <Badge color={ROLE_BADGE[row.role] || 'gray'}>{row.role}</Badge>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) =>
        row.isActive ? <Badge color="green">Active</Badge> : <Badge color="red">Inactive</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => <span className="text-gray-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) =>
        row.role === 'admin' ? (
          <span className="text-xs text-gray-400">—</span>
        ) : (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              loading={busyId === row._id}
              onClick={() => handleToggle(row)}
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
              Delete
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Manage Users" subtitle="View and manage all platform accounts." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:col-span-2"
        />
        <Select
          placeholder="All roles"
          options={[
            { value: 'student', label: 'Students' },
            { value: 'hr', label: 'Recruiters' },
            { value: 'admin', label: 'Admins' },
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <Table columns={columns} data={users} loading={loading} emptyMessage="No users found." />
      <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} onPageChange={setPage} />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busyId === deleteTarget?._id} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Delete <span className="font-medium text-gray-900">{deleteTarget?.name}</span>? This also
          removes their jobs and applications. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageUsers;
