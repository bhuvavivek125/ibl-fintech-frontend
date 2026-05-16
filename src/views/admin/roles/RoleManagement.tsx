import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Tab, Tabs, Chip, IconButton, Tooltip, Card, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
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
    { id: 'permissions', label: 'Permissions', minWidth: 100, format: (val: any[]) => <Typography variant="body2">{val?.length || 0} active</Typography> },
    {
      id: 'actions',
      label: 'Management',
      minWidth: 120,
      align: 'right',
      format: (_, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton 
            onClick={() => { 
              setSelectedItem(row); 
              // Normalize permissions to string IDs
              const normalizedPermissions = row.permissions?.map((p: any) => 
                typeof p === 'object' ? p._id : p
              ) || [];
              setRoleFormData({ ...row, permissions: normalizedPermissions }); 
              setIsRoleModalOpen(true); 
            }} 
            sx={{ color: 'primary.main', bgcolor: 'primary.light' }} 
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];

  const permissionColumns: Column[] = [
    { id: 'name', label: 'Permission', minWidth: 150, format: (val) => <Typography fontWeight={700}>{val}</Typography> },
    { id: 'slug', label: 'Identity Slug', minWidth: 150, format: (val) => <Chip label={val} size="small" sx={{ borderRadius: '6px', bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }} /> },
    { id: 'module', label: 'Module', minWidth: 120, format: (val) => <Chip label={val?.toUpperCase()} size="small" sx={{ fontWeight: 600 }} /> },
    { id: 'description', label: 'Description', minWidth: 250 },
  ];

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
        title={selectedItem ? 'Update Governance Role' : 'Create New Governance Role'}
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setIsRoleModalOpen(false)} variant="text" color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleCreateUpdateRole} loading={loading}>Save Role</Button>
          </Stack>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Input label="Role Name" value={roleFormData.name} onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })} />
          <Input label="Role Slug" value={roleFormData.slug} onChange={(e) => setRoleFormData({ ...roleFormData, slug: e.target.value })} />
          <Input label="Description" multiline rows={3} value={roleFormData.description} onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })} />
          
          <Typography variant="subtitle2" fontWeight={700}>Assign Permissions</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {permissions.map((p) => (
              <Chip
                key={p._id}
                label={p.name}
                onClick={() => {
                  const perms = roleFormData.permissions.includes(p._id)
                    ? roleFormData.permissions.filter(id => id !== p._id)
                    : [...roleFormData.permissions, p._id];
                  setRoleFormData({ ...roleFormData, permissions: perms });
                }}
                color={roleFormData.permissions.includes(p._id) ? 'primary' : 'default'}
                variant={roleFormData.permissions.includes(p._id) ? 'filled' : 'outlined'}
                sx={{ borderRadius: '8px' }}
              />
            ))}
          </Box>
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
