import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Stack, Chip, IconButton, Tooltip, Card, Grid, FormControl, InputLabel, Select, MenuItem, TextField, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, Search as SearchIcon, Security as SecurityIcon } from '@mui/icons-material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Table, { Column } from 'components/Table';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import userService from 'services/user.service';
import roleService from 'services/role.service';
import { useSnackbar } from 'notistack';
import useRBAC from 'hooks/useRBAC';

const MODULE_KEYS = {
  adminDashboard: 'Admin Dashboard',
  userManagement: 'User Management',
  rolePermission: 'Role & Permission',
  fileUpload: 'File Upload',
  settings: 'Settings',
  activityLogs: 'Activity Logs'
};

const getEmptyPermissionsObject = () => ({
  adminDashboard: { view: false, create: false, edit: false, delete: false },
  userManagement: { view: false, create: false, edit: false, delete: false },
  rolePermission: { view: false, create: false, edit: false, delete: false },
  fileUpload: { view: false, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
  activityLogs: { view: false, create: false, edit: false, delete: false }
});

const convertPermissionsArrayToObject = (permissionIds: string[], allPermissions: any[]) => {
  const permsObj = getEmptyPermissionsObject();
  
  Object.keys(MODULE_KEYS).forEach((moduleKey) => {
    const backendModuleName = MODULE_KEYS[moduleKey as keyof typeof MODULE_KEYS];
    const modulePerms = allPermissions.filter(p => p.module === backendModuleName);
    
    const viewPerm = modulePerms.find(p => /view|read|get|list|overview|history/i.test(p.slug));
    const createPerm = modulePerms.find(p => /create|add|upload|post|insert|new/i.test(p.slug));
    const editPerm = modulePerms.find(p => /update|edit|modify|put|patch|setting|config/i.test(p.slug));
    const deletePerm = modulePerms.find(p => /delete|remove|destroy|drop|cancel/i.test(p.slug));

    if (viewPerm && permissionIds.includes(viewPerm._id)) permsObj[moduleKey as keyof typeof MODULE_KEYS].view = true;
    if (createPerm && permissionIds.includes(createPerm._id)) permsObj[moduleKey as keyof typeof MODULE_KEYS].create = true;
    if (editPerm && permissionIds.includes(editPerm._id)) permsObj[moduleKey as keyof typeof MODULE_KEYS].edit = true;
    if (deletePerm && permissionIds.includes(deletePerm._id)) permsObj[moduleKey as keyof typeof MODULE_KEYS].delete = true;
  });

  return permsObj;
};

const convertPermissionsObjectToArray = (permsObj: any, allPermissions: any[]) => {
  const permissionIds: string[] = [];

  Object.keys(MODULE_KEYS).forEach((moduleKey) => {
    const backendModuleName = MODULE_KEYS[moduleKey as keyof typeof MODULE_KEYS];
    const modulePerms = allPermissions.filter(p => p.module === backendModuleName);

    const viewPerm = modulePerms.find(p => /view|read|get|list|overview|history/i.test(p.slug));
    const createPerm = modulePerms.find(p => /create|add|upload|post|insert|new/i.test(p.slug));
    const editPerm = modulePerms.find(p => /update|edit|modify|put|patch|setting|config/i.test(p.slug));
    const deletePerm = modulePerms.find(p => /delete|remove|destroy|drop|cancel/i.test(p.slug));

    const state = permsObj[moduleKey as keyof typeof MODULE_KEYS];
    if (state.view && viewPerm) permissionIds.push(viewPerm._id);
    if (state.create && createPerm) permissionIds.push(createPerm._id);
    if (state.edit && editPerm) permissionIds.push(editPerm._id);
    if (state.delete && deletePerm) permissionIds.push(deletePerm._id);
  });

  return permissionIds;
};

const UserList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { canCreate, canEdit, canDelete } = useRBAC();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [sortBy, setSortBy] = useState('desc');

  // User Permissions state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<any>(getEmptyPermissionsObject());

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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRes = await roleService.getRoles();
        setRoles(rolesRes.data.results || []);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = async (user: any) => {
    const roleValue = user?.role;
    const roleName = typeof roleValue === 'object' ? (roleValue?.key || roleValue?.slug || roleValue?.name || '') : (roleValue || '');
    if (roleName.toLowerCase() === 'super_admin') {
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
    const roleValue = user?.role;
    const roleName = typeof roleValue === 'object' ? (roleValue?.key || roleValue?.slug || roleValue?.name || '') : (roleValue || '');
    if (roleName.toLowerCase() === 'super_admin') {
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
      const resolvedRole = typeof selectedUser.role === 'object' ? (selectedUser.role.slug || selectedUser.role.key || selectedUser.role.name) : selectedUser.role;
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: '',
        mobileNumber: selectedUser.mobileNumber || '',
        role: resolvedRole || 'user',
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
    const roleValue = row?.role;
    const roleName = typeof roleValue === 'object' ? (roleValue?.key || roleValue?.slug || roleValue?.name || '') : (roleValue || '');
    if (roleName.toLowerCase() === 'super_admin') {
      enqueueSnackbar('Security Protocol: Super Admin has unrestricted access across all modules.', { variant: 'info' });
      return;
    }
    setSelectedUser(row);
    let allPerms = permissions;
    if (allPerms.length === 0) {
      try {
        const permsRes = await roleService.getPermissions();
        allPerms = permsRes.data?.results || [];
        setPermissions(allPerms);
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
    const initialPermsObj = convertPermissionsArrayToObject(currentPerms, allPerms);
    setSelectedUserPermissions(initialPermsObj);
    setIsPermissionModalOpen(true);
  };

  const handleSaveUserPermissions = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const permissionIds = convertPermissionsObjectToArray(selectedUserPermissions, permissions);
      await userService.updateUserPermissions(selectedUser._id, permissionIds);
      enqueueSnackbar("User permissions configured successfully!", { variant: 'success' });
      setIsPermissionModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      enqueueSnackbar(error.message || "Failed to update user permissions", { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns: Column[] = [
    {
      id: 'name', label: 'User Identity', minWidth: 200, format: (value: string, row: any) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'primary.main',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            {value ? value.charAt(0).toUpperCase() : 'U'}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.primary' }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{row.email}</Typography>
          </Box>
        </Stack>
      )
    },
    { id: 'mobileNumber', label: 'Contact', minWidth: 150 },
    {
      id: 'role',
      label: 'Access Level',
      minWidth: 150,
      format: (value: any) => {
        const roleText = typeof value === 'object' ? (value?.name || value?.slug || value?.key || '') : value;
        const roleLower = roleText?.toLowerCase() || '';
        let chipColor = '#6366f1';
        let chipBg = 'rgba(99, 102, 241, 0.08)';
        
        if (roleLower === 'super_admin') {
          chipColor = '#f59e0b';
          chipBg = 'rgba(245, 158, 11, 0.08)';
        } else if (roleLower === 'admin') {
          chipColor = '#10b981';
          chipBg = 'rgba(16, 185, 129, 0.08)';
        } else {
          chipColor = '#3b82f6';
          chipBg = 'rgba(59, 130, 246, 0.08)';
        }
        
        return (
          <Chip
            label={roleText?.toUpperCase() || ''}
            sx={{
              borderRadius: '8px',
              fontWeight: 700,
              bgcolor: chipBg,
              color: chipColor,
              border: `1px solid ${chipColor}15`,
              fontSize: '0.72rem',
              letterSpacing: '0.3px'
            }}
          />
        );
      }
    },
    {
      id: 'isActive',
      label: 'Security Status',
      minWidth: 150,
      format: (value: boolean, row: any) => {
        const statusColor = value ? '#10b981' : '#ef4444';
        const statusBg = value ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)';
        return (
          <Chip
            label={value ? 'Verified Active' : 'Suspended'}
            onClick={() => handleToggleStatus(row)}
            sx={{
              borderRadius: '8px',
              fontWeight: 700,
              bgcolor: statusBg,
              color: statusColor,
              cursor: 'pointer',
              border: `1px solid ${statusColor}18`,
              fontSize: '0.72rem',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: value ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                transform: 'translateY(-1px)'
              }
            }}
          />
        );
      }
    },
    {
      id: 'createdAt', label: 'Registration', minWidth: 150, format: (value: string) => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Management',
      minWidth: 160,
      align: 'right',
      format: (_, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">

          {canEdit('user') && (
            <Tooltip title="Modify Access">
              <IconButton
                onClick={() => { setSelectedUser(row); setIsModalOpen(true); }}
                color="secondary"
                size="small"
              >
                <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
              </IconButton>
            </Tooltip>
          )}
          {canDelete('user') && (
            <Tooltip title="Revoke Permissions">
              <IconButton
                onClick={() => handleDelete(row._id)}
                color="error"
                size="small"
              >
                <DeleteTwoToneIcon sx={{ fontSize: '1.3rem' }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Box p={{ xs: 2, sm: 4 }} sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={{ xs: 3, sm: 5 }}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text" sx={{ letterSpacing: '-0.5px', mb: 0.5 }}>
            Identity Governance
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            Manage your digital ecosystem and user privileges
          </Typography>
        </Box>
        {canCreate('user') && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            className="hover-glow"
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              width: { xs: '100%', sm: 'auto' },
              background: 'linear-gradient(135deg, var(--palette-primary-main) 0%, var(--palette-primary-dark) 100%)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Provision New Identity
          </Button>
        )}
      </Stack>

      <Card className="premium-card" sx={{ p: { xs: 2, sm: 3 }, mb: 4, border: 'none', maxWidth: '100%', overflow: 'hidden' }}>
        <Stack spacing={3}>
          {/* Top Row: Search */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Input
                placeholder="Search identities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'background.paper' } }}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1.5 }} />
                }}
              />
            </Box>
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="contained"
                onClick={() => handleSearch()}
                startIcon={<SearchIcon />}
                sx={{ borderRadius: '12px', px: 4, height: 48, textTransform: 'none', fontWeight: 600, flexGrow: { xs: 1, sm: 0 } }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={fetchUsers}
                startIcon={<RefreshIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  height: 48,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'divider',
                  color: 'text.primary',
                  flexGrow: { xs: 1, sm: 0 },
                  '&:hover': {
                    borderColor: 'text.secondary',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                Sync
              </Button>
            </Stack>
          </Stack>

          {/* Bottom Row: Filters */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }} size="small">
              <InputLabel id="role-label" sx={{ fontWeight: 500 }}>Filter by Role</InputLabel>
              <Select
                labelId="role-label"
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
                sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}
              >
                <MenuItem value="">All Access Levels</MenuItem>
                <MenuItem value="user">Standard Users</MenuItem>
                <MenuItem value="admin">Administrators</MenuItem>
                <MenuItem value="super_admin">Super Admins</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }} size="small">
              <InputLabel id="status-label" sx={{ fontWeight: 500 }}>Security Status</InputLabel>
              <Select
                labelId="status-label"
                value={filterStatus}
                label="Security Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Active">Verified Active</MenuItem>
                <MenuItem value="Inactive">Suspended</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: { xs: '100%', md: 160 } }} size="small">
              <InputLabel id="sort-label" sx={{ fontWeight: 500 }}>Sort Order</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort Order"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}
              >
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>

      <Box className="premium-card" sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto', border: 'none' }}>
        <Table
          columns={columns}
          data={users}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={loading}
          sx={{ boxShadow: 'none', background: 'transparent' }}
        />
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Modify Digital Identity' : 'Provision New Identity'}
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsModalOpen(false)} variant="text" sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateUpdate}
              loading={loading}
              sx={{
                borderRadius: '10px',
                px: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--palette-primary-main) 0%, var(--palette-primary-dark) 100%)'
              }}
            >
              {selectedUser ? 'Confirm Changes' : 'Execute Provision'}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={3} sx={{ mt: 1.5 }}>
          <Input
            name="name"
            label="Full Legal Name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="new-password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Input
            name="email"
            label="Official Email Address"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="new-password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Input
            name="mobileNumber"
            label="Contact Number"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            autoComplete="new-password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          {!selectedUser && (
            <Input
              name="password"
              label="Secure Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
              '& .MuiInputLabel-root': { fontWeight: 500 }
            }}
          >
            {roles.map((r: any) => (
              <option key={r._id} value={r.slug}>
                {r.name}
              </option>
            ))}
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
            <Button onClick={() => setIsPermissionModalOpen(false)} variant="text" sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveUserPermissions}
              loading={loading}
              sx={{
                borderRadius: '10px',
                px: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--palette-primary-main) 0%, var(--palette-primary-dark) 100%)'
              }}
            >
              Save Permissions
            </Button>
          </Stack>
        }
        maxWidth="md"
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: -1.5, mb: 1, display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>
            By default, this user inherits standard permissions from their assigned role ({(() => {
              const roleVal = selectedUser?.role;
              const roleText = typeof roleVal === 'object' ? (roleVal?.name || roleVal?.slug || roleVal?.key) : roleVal;
              return roleText?.toUpperCase() || 'USER';
            })()}). Check any boxes below to override with custom user-specific privileges.
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', maxHeight: 420 }}>
            <MuiTable size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 2, px: 3, fontWeight: 700, width: '40%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>Menu / Sub-Menu</TableCell>
                  <TableCell align="center" sx={{ py: 2, fontWeight: 700, width: '15%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>View</TableCell>
                  <TableCell align="center" sx={{ py: 2, fontWeight: 700, width: '15%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>Create</TableCell>
                  <TableCell align="center" sx={{ py: 2, fontWeight: 700, width: '15%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>Edit</TableCell>
                  <TableCell align="center" sx={{ py: 2, fontWeight: 700, width: '15%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(MODULE_KEYS).map(([moduleKey, moduleName]) => {
                  const state = selectedUserPermissions[moduleKey as keyof typeof MODULE_KEYS] || { view: false, create: false, edit: false, delete: false };
                  
                  const handleCheckboxChange = (action: 'view' | 'create' | 'edit' | 'delete') => {
                    const newPermissions = {
                      ...selectedUserPermissions,
                      [moduleKey]: {
                        ...selectedUserPermissions[moduleKey as keyof typeof MODULE_KEYS],
                        [action]: !state[action]
                      }
                    };
                    setSelectedUserPermissions(newPermissions);
                  };

                  return (
                    <TableRow key={moduleKey} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ py: 1.5, px: 3, fontWeight: 600, color: 'text.secondary' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" color="text.disabled">└</Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">{moduleName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Checkbox
                          checked={state.view}
                          onChange={() => handleCheckboxChange('view')}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Checkbox
                          checked={state.create}
                          onChange={() => handleCheckboxChange('create')}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Checkbox
                          checked={state.edit}
                          onChange={() => handleCheckboxChange('edit')}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Checkbox
                          checked={state.delete}
                          onChange={() => handleCheckboxChange('delete')}
                          color="primary"
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
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
