import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, IconButton, Tooltip, Card, Grid, FormControl, InputLabel, Select, MenuItem, TextField, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon, Search as SearchIcon, Security as SecurityIcon } from '@mui/icons-material';
import Table, { Column } from 'components/Table';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import userService from 'services/user.service';
import roleService from 'services/role.service';
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

  // User Permissions state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<string[]>([]);


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

  const handleOpenPermissionModal = async (row: any) => {
    if (row.role === 'super_admin') {
      enqueueSnackbar('Security Protocol: Super Admin has unrestricted access across all modules.', { variant: 'info' });
      return;
    }
    setSelectedUser(row);
    if (permissions.length === 0) {
      try {
        const permsRes = await roleService.getPermissions();
        setPermissions(permsRes.data?.results || []);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      }
    }
    let currentPerms: string[] = [];
    if (Array.isArray(row.permissions) && row.permissions.length > 0) {
      currentPerms = row.permissions.map((p: any) => typeof p === 'object' ? p._id : p);
    } else if (row.roleId && Array.isArray(row.roleId.permissions)) {
      currentPerms = row.roleId.permissions.map((p: any) => typeof p === 'object' ? p._id : p);
    }
    setSelectedUserPermissions(currentPerms);
    setIsPermissionModalOpen(true);
  };

  const handleSaveUserPermissions = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await userService.updateUserPermissions(selectedUser._id, selectedUserPermissions);
      enqueueSnackbar("User permissions configured successfully!", { variant: 'success' });
      setIsPermissionModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      enqueueSnackbar(error.message || "Failed to update user permissions", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const ALLOWED_MODULES = [
    'Admin Dashboard',
    'User Management',
    'Role & Permission',
    'File Upload',
    'Settings',
    'Activity Logs'
  ];

  const groupedPermissions = permissions.reduce((acc: any, curr: any) => {
    if (!curr || !curr.slug) return acc;
    const slug = curr.slug.toLowerCase();

    let modName = '';
    if (slug.startsWith('dashboard')) modName = 'Admin Dashboard';
    else if (slug.startsWith('user')) modName = 'User Management';
    else if (slug.startsWith('role')) modName = 'Role & Permission';
    else if (slug.startsWith('file') || (slug.startsWith('upload') && !slug.includes('history'))) modName = 'File Upload';
    else if (slug.startsWith('setting')) modName = 'Settings';
    else if (slug.startsWith('activity')) modName = 'Activity Logs';

    if (modName && ALLOWED_MODULES.includes(modName)) {
      if (!acc[modName]) acc[modName] = [];
      acc[modName].push({ ...curr, module: modName });
    }
    return acc;
  }, {
    'Admin Dashboard': [],
    'User Management': [],
    'Role & Permission': [],
    'File Upload': [],
    'Settings': [],
    'Activity Logs': []
  });

  const getModuleActionPerms = (perms: any[]) => {
    const assignedIds = new Set<string>();

    let view = perms.find(p => !assignedIds.has(p._id) && (/view|read|get|list|overview|history|logs/i.test(p.slug) || /view|read|list|overview|history|logs/i.test(p.name)));
    if (view) assignedIds.add(view._id);

    let add = perms.find(p => !assignedIds.has(p._id) && (/create|add|upload|post|insert|new/i.test(p.slug) || /create|add|upload|insert|new/i.test(p.name)));
    if (add) assignedIds.add(add._id);

    let edit = perms.find(p => !assignedIds.has(p._id) && (/update|edit|modify|put|patch|setting|config/i.test(p.slug) || /update|edit|modify|setting|config/i.test(p.name)));
    if (edit) assignedIds.add(edit._id);

    let del = perms.find(p => !assignedIds.has(p._id) && (/delete|remove|destroy|drop|cancel/i.test(p.slug) || /delete|remove|destroy/i.test(p.name)));
    if (del) assignedIds.add(del._id);

    const remaining = perms.filter(p => !assignedIds.has(p._id));

    if (!view && remaining.length > 0) { view = remaining.shift(); if (view) assignedIds.add(view._id); }
    if (!add && remaining.length > 0) { add = remaining.shift(); if (add) assignedIds.add(add._id); }
    if (!edit && remaining.length > 0) { edit = remaining.shift(); if (edit) assignedIds.add(edit._id); }
    if (!del && remaining.length > 0) { del = remaining.shift(); if (del) assignedIds.add(del._id); }

    return { view, add, edit, del };
  };

  const renderCheckbox = (permId: string) => {
    const isChecked = selectedUserPermissions.includes(permId);
    return (
      <Checkbox
        checked={isChecked}
        onChange={() => {
          const newPerms = isChecked
            ? selectedUserPermissions.filter(id => id !== permId)
            : [...selectedUserPermissions, permId];
          setSelectedUserPermissions(newPerms);
        }}
        color="primary"
        size="small"
        sx={{ borderRadius: 1 }}
      />
    );
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
          <Tooltip title={row.role === 'super_admin' ? "Super Admin permissions cannot be modified" : "Configure Custom Permissions"}>
            <span>
              <IconButton 
                onClick={() => handleOpenPermissionModal(row)} 
                disabled={row.role === 'super_admin'}
                sx={{ 
                  color: 'warning.main', 
                  bgcolor: 'warning.light', 
                  borderRadius: '10px',
                  ...(row.role === 'super_admin' && { opacity: 0.4, cursor: 'not-allowed' })
                }} 
                size="small"
              >
                <SecurityIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
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

      {/* User Permissions Modal */}
      <Modal
        open={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        title={selectedUser ? `Custom Permissions — ${selectedUser.name}` : 'Configure User Permissions'}
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsPermissionModalOpen(false)} variant="text" color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleSaveUserPermissions} loading={loading}>Save Permissions</Button>
          </Stack>
        }
        maxWidth="md"
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: -2, mb: 1, display: 'block', fontSize: '0.85rem' }}>
            By default, this user inherits standard permissions from their assigned role ({selectedUser?.role?.toUpperCase() || 'USER'}). Check any boxes below to override with custom user-specific privileges.
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', maxHeight: 420 }}>
            <MuiTable size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1.8, px: 3, fontWeight: 700, width: '40%', bgcolor: 'rgba(0,0,0,0.02)' }}>Menu / Sub-Menu</TableCell>
                  <TableCell align="center" sx={{ py: 1.8, fontWeight: 700, width: '15%', bgcolor: 'rgba(0,0,0,0.02)' }}>View</TableCell>
                  <TableCell align="center" sx={{ py: 1.8, fontWeight: 700, width: '15%', bgcolor: 'rgba(0,0,0,0.02)' }}>Add</TableCell>
                  <TableCell align="center" sx={{ py: 1.8, fontWeight: 700, width: '15%', bgcolor: 'rgba(0,0,0,0.02)' }}>Edit</TableCell>
                  <TableCell align="center" sx={{ py: 1.8, fontWeight: 700, width: '15%', bgcolor: 'rgba(0,0,0,0.02)' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedPermissions).map(([moduleName, modulePerms]: [string, any]) => {
                  const { view, add, edit, del } = getModuleActionPerms(modulePerms as any[]);
                  return (
                    <TableRow key={moduleName} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ py: 1.5, px: 3, fontWeight: 600, color: 'text.secondary' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" color="text.disabled">└</Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">{moduleName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        {view ? renderCheckbox(view._id) : <Typography color="text.disabled" sx={{ fontWeight: 700 }}>—</Typography>}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        {add ? renderCheckbox(add._id) : <Typography color="text.disabled" sx={{ fontWeight: 700 }}>—</Typography>}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        {edit ? renderCheckbox(edit._id) : <Typography color="text.disabled" sx={{ fontWeight: 700 }}>—</Typography>}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        {del ? renderCheckbox(del._id) : <Typography color="text.disabled" sx={{ fontWeight: 700 }}>—</Typography>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Stack>
      </Modal>
    </Box>
  );
};

export default UserList;

