import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, IconButton, Tooltip, Card, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import Table, { Column } from 'components/Table';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import userService from 'services/user.service';
import { useSnackbar } from 'notistack';

const UserList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('desc');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: page + 1,
        limit,
        search,
        sortBy
      };

      if (filterRole) params.role = filterRole;
      if (filterStatus) params.status = filterStatus;

      const response = await userService.getUsers(params);
      if (response.success) {
        setUsers(response.data.results || []);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filterRole, filterStatus, sortBy]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = async (user: any) => {
    if (user.role === 'super_admin') {
      enqueueSnackbar('Security Protocol: Super Admin status cannot be modified.', { variant: 'warning' });
      return;
    }

    try {
      if (user.isActive) {
        await userService.deactivateUser(user._id);
      } else {
        await userService.activateUser(user._id);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const user = users.find((u: any) => u._id === id);
    if (user?.role === 'super_admin') {
      enqueueSnackbar('Security Protocol: Super Admin accounts cannot be revoked.', { variant: 'error' });
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: 'user',
    isActive: true
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: '',
        mobileNumber: selectedUser.mobileNumber || '',
        role: selectedUser.role || 'user',
        isActive: selectedUser.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: 'user',
        isActive: true
      });
    }
  }, [selectedUser, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCreateUpdate = async () => {
    setLoading(true);
    try {
      if (selectedUser) {
        const { password, ...updateData } = formData;
        const response = await userService.updateUser(selectedUser._id, updateData);
        if (response.success) {
          enqueueSnackbar('User updated successfully!', { variant: 'success' });
        }
      } else {
        const response = await userService.createUser(formData);
        if (response.success) {
          enqueueSnackbar('User provisioned successfully!', { variant: 'success' });
        }
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      enqueueSnackbar(error.message || 'Operation failed. Verify security privileges.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    {
      id: 'name', label: 'User Identity', minWidth: 200, format: (value: string, row: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'primary.main' }}>
            {value ? value.charAt(0) : 'U'}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          </Box>
        </Stack>
      )
    },
    { id: 'mobileNumber', label: 'Contact', minWidth: 150 },
    {
      id: 'role', label: 'Access Level', minWidth: 150, format: (value: string) => (
        <Chip label={value?.toUpperCase()} sx={{ borderRadius: '8px', fontWeight: 700, bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }} />
      )
    },
    {
      id: 'isActive',
      label: 'Security Status',
      minWidth: 150,
      format: (value: boolean, row: any) => (
        <Chip
          label={value ? 'Verified Active' : 'Suspended'}
          variant={value ? 'filled' : 'outlined'}
          color={value ? 'success' : 'error'}
          onClick={() => handleToggleStatus(row)}
          sx={{ borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        />
      )
    },
    {
      id: 'createdAt', label: 'Registration', minWidth: 150, format: (value: string) => (
        <Typography variant="body2" color="text.secondary">{new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
      )
    },
    {
      id: 'actions',
      label: 'Management',
      minWidth: 120,
      align: 'right',
      format: (_, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Modify Access">
            <IconButton onClick={() => { setSelectedUser(row); setIsModalOpen(true); }} sx={{ color: 'primary.main', bgcolor: 'primary.light', borderRadius: '10px' }} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Revoke Permissions">
            <IconButton onClick={() => handleDelete(row._id)} sx={{ color: 'error.main', bgcolor: 'error.light', borderRadius: '10px' }} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text">Identity Governance</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>Manage your digital ecosystem and user privileges</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          sx={{ borderRadius: '14px', px: 4, py: 1.5, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}
        >
          Provision New Identity
        </Button>
      </Stack>

      <Card className="glass" sx={{ p: 3, mb: 4, borderRadius: '24px', border: 'none' }}>
        <Stack spacing={3}>
          {/* Top Row: Search */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <Input
                placeholder="Search identities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1.5 }} />
                }}
              />
            </Box>
            <Button variant="contained" onClick={() => handleSearch()} startIcon={<SearchIcon />} sx={{ borderRadius: '14px', px: 4, height: 48 }}>
              Search
            </Button>
            <Button variant="outlined" onClick={fetchUsers} startIcon={<RefreshIcon />} sx={{ borderRadius: '14px', px: 3, height: 48 }}>
              Sync
            </Button>
          </Stack>

          {/* Bottom Row: Filters */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="role-label">Filter by Role</InputLabel>
              <Select
                labelId="role-label"
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="">All Access Levels</MenuItem>
                <MenuItem value="user">Standard Users</MenuItem>
                <MenuItem value="admin">Administrators</MenuItem>
                <MenuItem value="super_admin">Super Admins</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="status-label">Security Status</InputLabel>
              <Select
                labelId="status-label"
                value={filterStatus}
                label="Security Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Active">Verified Active</MenuItem>
                <MenuItem value="Inactive">Suspended</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="sort-label">Sort Order</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort Order"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>

      <Box className="glass" sx={{ borderRadius: '24px', overflow: 'hidden', border: 'none' }}>
        <Table
          columns={columns}
          data={users}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
        />
      </Box>


      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Modify Digital Identity' : 'Provision New Identity'}
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsModalOpen(false)} variant="text" color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleCreateUpdate} loading={loading}>
              {selectedUser ? 'Confirm Changes' : 'Execute Provision'}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Input
            name="name"
            label="Full Legal Name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <Input
            name="email"
            label="Official Email Address"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <Input
            name="mobileNumber"
            label="Contact Number"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          {!selectedUser && (
            <Input
              name="password"
              label="Secure Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
          )}
          <TextField
            select
            name="role"
            label="Access Privilege Level"
            value={formData.role}
            onChange={handleInputChange}
            fullWidth
            SelectProps={{ native: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
          >
            <option value="user">Standard User</option>
            <option value="admin">System Administrator</option>
            <option value="super_admin">Enterprise Super Admin</option>
          </TextField>
        </Stack>
      </Modal>
    </Box>
  );
};

export default UserList;
