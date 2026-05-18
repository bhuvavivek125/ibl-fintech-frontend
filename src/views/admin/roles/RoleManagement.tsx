import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Tab, Tabs, Chip, IconButton, Tooltip, Card, Grid, FormControl, InputLabel, Select, MenuItem, TextField, TableContainer, Table as MuiTable, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon, Security as SecurityIcon, Menu as MenuIcon } from '@mui/icons-material';
import Table, { Column } from 'components/Table';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import roleService from 'services/role.service';
import { useSnackbar } from 'notistack';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const RoleManagement: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [rolesPage, setRolesPage] = useState(0);
  const [rolesLimit, setRolesLimit] = useState(10);
  const [permsPage, setPermsPage] = useState(0);
  const [permsLimit, setPermsLimit] = useState(10);
  
  // Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form Data
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    slug: '',
    description: '',
    permissions: [] as string[],
    allowedMenus: [] as any[]
  });

  const [permissionFormData, setPermissionFormData] = useState({
    name: '',
    slug: '',
    module: '',
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions()
      ]);
      setRoles(rolesRes.data.results || []);
      setPermissions(permsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateUpdatePermission = async () => {
    try {
      await roleService.createPermission(permissionFormData);
      enqueueSnackbar('Permission created successfully!', { variant: 'success' });
      setIsPermissionModalOpen(false);
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to create permission', { variant: 'error' });
    }
  };

  const handleCreateUpdateRole = async () => {
    try {
      if (selectedItem) {
        await roleService.updateRole(selectedItem._id, roleFormData);
        enqueueSnackbar('Role updated successfully!', { variant: 'success' });
      } else {
        await roleService.createRole(roleFormData);
        enqueueSnackbar('Role created successfully!', { variant: 'success' });
      }
      setIsRoleModalOpen(false);
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to save role', { variant: 'error' });
    }
  };

  const roleColumns: Column[] = [
    { id: 'name', label: 'Role Name', minWidth: 150, format: (val) => <Typography fontWeight={700}>{val}</Typography> },
    { id: 'slug', label: 'Key', minWidth: 150, format: (val) => <Chip label={val} size="small" variant="outlined" sx={{ borderRadius: '6px' }} /> },
    { id: 'description', label: 'Description', minWidth: 250 },
    { 
      id: 'permissions', 
      label: 'Permissions', 
      minWidth: 100, 
      format: (val: any[], row: any) => {
        const isSuperAdmin = row?.slug === 'super_admin' || row?.slug === 'super-admin' || row?.name?.toLowerCase() === 'super admin';
        if (isSuperAdmin) {
          return <Chip label="All Permissions" size="small" color="primary" sx={{ fontWeight: 600, borderRadius: '6px' }} />;
        }
        return <Typography variant="body2">{val?.length || 0} active</Typography>;
      } 
    },
    {
      id: 'actions',
      label: 'Management',
      minWidth: 120,
      align: 'right',
      format: (_, row: any) => {
        const isSuperAdmin = row?.slug === 'super_admin' || row?.slug === 'super-admin' || row?.name?.toLowerCase() === 'super admin';
        return (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title={isSuperAdmin ? "Super Admin has unrestricted access by default and cannot be modified" : "Modify Permissions"}>
              <span>
                <IconButton 
                  onClick={() => { 
                    if (isSuperAdmin) return;
                    setSelectedItem(row); 
                    // Normalize permissions to string IDs
                    const normalizedPermissions = row.permissions?.map((p: any) => 
                      typeof p === 'object' ? p._id : p
                    ) || [];
                    setRoleFormData({ ...row, permissions: normalizedPermissions }); 
                    setIsRoleModalOpen(true); 
                  }} 
                  disabled={isSuperAdmin}
                  sx={{ 
                    color: 'primary.main', 
                    bgcolor: 'primary.light',
                    ...(isSuperAdmin && { opacity: 0.4, cursor: 'not-allowed' })
                  }} 
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  const permissionColumns: Column[] = [
    { id: 'name', label: 'Permission', minWidth: 150, format: (val) => <Typography fontWeight={700}>{val}</Typography> },
    { id: 'slug', label: 'Identity Slug', minWidth: 150, format: (val) => <Chip label={val} size="small" sx={{ borderRadius: '6px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }} /> },
    { id: 'module', label: 'Module', minWidth: 120, format: (val) => <Chip label={val?.toUpperCase()} size="small" sx={{ fontWeight: 600 }} /> },
    { id: 'description', label: 'Description', minWidth: 250 },
  ];

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
    const isChecked = roleFormData.permissions.includes(permId);
    return (
      <Checkbox
        checked={isChecked}
        onChange={() => {
          const newPerms = isChecked
            ? roleFormData.permissions.filter(id => id !== permId)
            : [...roleFormData.permissions, permId];
          setRoleFormData({ ...roleFormData, permissions: newPerms });
        }}
        color="primary"
        size="small"
        sx={{ borderRadius: 1 }}
      />
    );
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text">Role & Permission Engine</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>Configure granular access control and menu visibility</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={tabValue === 0 ? <SecurityIcon /> : <AddIcon />} 
          onClick={() => {
            setSelectedItem(null);
            if (tabValue === 0) {
              setRoleFormData({ name: '', slug: '', description: '', permissions: [], allowedMenus: [] });
              setIsRoleModalOpen(true);
            } else {
              setPermissionFormData({ name: '', slug: '', module: '', description: '' });
              setIsPermissionModalOpen(true);
            }
          }}
          sx={{ borderRadius: '12px', px: 4 }}
        >
          {tabValue === 0 ? 'Create New Role' : 'Define Permission'}
        </Button>
      </Stack>

      <Card className="glass" sx={{ borderRadius: '24px', border: 'none', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontWeight: 700, fontSize: '1rem', py: 2 } }}>
            <Tab label="Access Roles" />
            <Tab label="Permission Registry" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Table 
            columns={roleColumns} 
            data={roles} 
            loading={loading} 
            totalCount={roles.length}
            page={rolesPage}
            limit={rolesLimit}
            onPageChange={setRolesPage}
            onLimitChange={setRolesLimit}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Table 
            columns={permissionColumns} 
            data={permissions} 
            loading={loading} 
            totalCount={permissions.length}
            page={permsPage}
            limit={permsLimit}
            onPageChange={setPermsPage}
            onLimitChange={setPermsLimit}
          />
        </TabPanel>
      </Card>

      {/* Role Modal */}
      <Modal
        open={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={selectedItem ? `Permissions — ${selectedItem.name}` : 'Create Governance Role'}
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsRoleModalOpen(false)} variant="text" color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleCreateUpdateRole} loading={loading}>Save Permissions</Button>
          </Stack>
        }
        maxWidth="md"
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: -2, mb: 1, display: 'block', fontSize: '0.85rem' }}>
            Changes apply to all users under this role immediately.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Input label="Role Name" value={roleFormData.name} onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })} />
            <Input label="Role Slug" value={roleFormData.slug} onChange={(e) => setRoleFormData({ ...roleFormData, slug: e.target.value })} />
          </Stack>
          <Input label="Description" multiline rows={2} value={roleFormData.description} onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })} />
          
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

      {/* Permission Modal */}
      <Modal
        open={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        title="Define New System Permission"
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsPermissionModalOpen(false)} variant="text" color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleCreateUpdatePermission} loading={loading}>Create Permission</Button>
          </Stack>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Input label="Permission Name" value={permissionFormData.name} onChange={(e) => setPermissionFormData({ ...permissionFormData, name: e.target.value })} />
          <Input label="Slug (e.g. users.view)" value={permissionFormData.slug} onChange={(e) => setPermissionFormData({ ...permissionFormData, slug: e.target.value })} />
          <Input label="Module" value={permissionFormData.module} onChange={(e) => setPermissionFormData({ ...permissionFormData, module: e.target.value })} />
          <Input label="Description" multiline rows={3} value={permissionFormData.description} onChange={(e) => setPermissionFormData({ ...permissionFormData, description: e.target.value })} />
        </Stack>
      </Modal>
    </Box>
  );
};

export default RoleManagement;
