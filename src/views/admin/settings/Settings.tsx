import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Card, Grid, TextField, Switch, FormControlLabel, InputAdornment, MenuItem, Tab, Tabs, Divider, CircularProgress, Alert, Fade, Skeleton } from '@mui/material';
import { Settings as SettingsIcon, Security as SecurityIcon, AccountBalanceWallet as FintechIcon, NotificationsActive as IntegrationsIcon, Save as SaveIcon, Restore as ResetIcon } from '@mui/icons-material';
import Button from 'components/Button';
import settingsService from 'services/settings.service';
import { useSnackbar } from 'notistack';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  const [mounted, setMounted] = useState(false);

  // Keep the tab mounted once it has been visited to prevent layout jumping/jittering on toggle
  useEffect(() => {
    if (value === index) {
      setMounted(true);
    }
  }, [value, index]);

  if (!mounted) return null;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      style={{ display: value === index ? 'block' : 'none' }}
      {...other}
    >
      <Fade in={value === index} timeout={350}>
        <Box sx={{ pt: 4 }}>{children}</Box>
      </Fade>
    </div>
  );
};

// Premium Skeleton structure mimicking the form layout to preserve spatial integrity during loads
const SettingsSkeleton: React.FC = () => (
  <Card className="premium-card" sx={{ p: 4, border: 'none' }}>
    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 4, bgcolor: 'action.hover' }} />
    <Grid container spacing={4}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid key={item} size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '14px', bgcolor: 'action.hover' }} />
        </Grid>
      ))}
      <Grid size={12}>
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '16px', mt: 2, bgcolor: 'action.hover' }} />
      </Grid>
    </Grid>
  </Card>
);

const SettingsDashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    // General
    platformName: 'IBL Finance Platform',
    supportEmail: 'support@iblfinance.com',
    supportPhone: '+91 80000 12345',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,

    // Security
    sessionTimeoutMinutes: 30,
    passwordRotationDays: 90,
    maxFailedLoginAttempts: 5,
    requireMfa: true,
    ipGeoFencing: false,

    // Fintech Rules
    defaultProcessingFeePct: 2.5,
    maxAllowedApr: 36.0,
    minCibilThreshold: 700,
    latePaymentDailyPenaltyPct: 0.1,

    // Integrations
    smsGatewayProvider: 'Msg91',
    emailSmtpHost: 'smtp.sendgrid.net',
    emailSmtpPort: 587,
    broadcastDailyLedger: true,
    webhookSecretKey: 'whsec_live_9f8d7c6b5a4e3d2c1b0a'
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsService.getSettings();
      if (response.success && response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      enqueueSnackbar(error.message || 'Failed to fetch settings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsService.updateSettings(settings);
      if (response.success) {
        enqueueSnackbar('Enterprise global configuration updated successfully!', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Error updating settings:', error);
      enqueueSnackbar(error.message || 'Failed to update configuration', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to restore system defaults? Any unsaved changes will be lost.')) {
      setSettings({
        platformName: 'IBL Finance Platform',
        supportEmail: 'support@iblfinance.com',
        supportPhone: '+91 80000 12345',
        currencySymbol: '₹',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false,
        sessionTimeoutMinutes: 30,
        passwordRotationDays: 90,
        maxFailedLoginAttempts: 5,
        requireMfa: true,
        ipGeoFencing: false,
        defaultProcessingFeePct: 2.5,
        maxAllowedApr: 36.0,
        minCibilThreshold: 700,
        latePaymentDailyPenaltyPct: 0.1,
        smsGatewayProvider: 'Msg91',
        emailSmtpHost: 'smtp.sendgrid.net',
        emailSmtpPort: 587,
        broadcastDailyLedger: true,
        webhookSecretKey: 'whsec_live_9f8d7c6b5a4e3d2c1b0a'
      });
      enqueueSnackbar('Settings restored to defaults. Click "Save Changes" to persist.', { variant: 'info' });
    }
  };

  if (loading) {
    return (
      <Box p={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header Skeleton */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} mb={5}>
          <Box sx={{ width: '40%' }}>
            <Skeleton variant="text" height={40} width="80%" sx={{ mb: 1, bgcolor: 'action.hover' }} />
            <Skeleton variant="text" height={24} width="100%" sx={{ bgcolor: 'action.hover' }} />
          </Box>
          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Skeleton variant="rectangular" width={140} height={48} sx={{ borderRadius: '12px', bgcolor: 'action.hover' }} />
            <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: '12px', bgcolor: 'action.hover' }} />
          </Stack>
        </Stack>

        {/* Tabs Bar Skeleton */}
        <Card className="premium-card" sx={{ px: 2, py: 1.5, borderRadius: '20px', border: 'none', mb: 4 }}>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: '10px', bgcolor: 'action.hover' }} />
            <Skeleton variant="rectangular" width={220} height={40} sx={{ borderRadius: '10px', bgcolor: 'action.hover' }} />
            <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: '10px', bgcolor: 'action.hover' }} />
            <Skeleton variant="rectangular" width={220} height={40} sx={{ borderRadius: '10px', bgcolor: 'action.hover' }} />
          </Stack>
        </Card>

        {/* Content Skeleton */}
        <SettingsSkeleton />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 4 }} sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} mb={{ xs: 3, sm: 5 }}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text">Enterprise Global Settings</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>Configure platform operations, compliance rules, and fintech parameters</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ResetIcon />}
            onClick={handleResetDefaults}
            sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 600, flexGrow: { xs: 1, md: 0 } }}
          >
            Reset Defaults
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            loading={saving}
            sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)', flexGrow: { xs: 1, md: 0 } }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>

      {/* Tabs Bar */}
      <Card className="glass" sx={{ px: 2, pt: 1, borderRadius: '20px', border: 'none', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': { py: 2.5, px: 3, fontWeight: 700, fontSize: '0.95rem', borderRadius: '14px', textTransform: 'none', minHeight: 48 },
            '& .Mui-selected': { color: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.08)' },
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px', bgcolor: 'primary.main' }
          }}
        >
          <Tab icon={<SettingsIcon sx={{ mr: 1 }} />} iconPosition="start" label="General & Brand" />
          <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Security & Governance" />
          <Tab icon={<FintechIcon sx={{ mr: 1 }} />} iconPosition="start" label="Fintech & Loan Rules" />
          <Tab icon={<IntegrationsIcon sx={{ mr: 1 }} />} iconPosition="start" label="Notifications & Gateways" />
        </Tabs>
      </Card>

      {/* Content Panels Container with stable min-height to prevent vertical page collapse during switching */}
      <Box sx={{ minHeight: 520, width: '100%' }}>
        {/* Tab 1: General & Brand */}
        <TabPanel value={activeTab} index={0}>
          <Card className="glass" sx={{ p: 4, borderRadius: '24px', border: 'none', minHeight: 500, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight={700} mb={4} color="primary.main">Platform Information</Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Platform Brand Name"
                  value={settings.platformName}
                  onChange={e => handleChange('platformName', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="System Timezone"
                  value={settings.timezone}
                  onChange={e => handleChange('timezone', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Support Email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={e => handleChange('supportEmail', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Customer Support Helpline"
                  value={settings.supportPhone}
                  onChange={e => handleChange('supportPhone', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Default Currency Symbol"
                  value={settings.currencySymbol}
                  onChange={e => handleChange('currencySymbol', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 3, bgcolor: 'error.light', color: 'error.dark', borderRadius: '16px' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>System Maintenance Mode</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>When enabled, standard users will be redirected to the maintenance downtime screen.</Typography>
                    </Box>
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={e => handleChange('maintenanceMode', e.target.checked)}
                      color="error"
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Tab 2: Security & Governance */}
        <TabPanel value={activeTab} index={1}>
          <Card className="glass" sx={{ p: 4, borderRadius: '24px', border: 'none', minHeight: 500, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight={700} mb={4} color="primary.main">Security Compliance Policies</Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Session Idle Timeout"
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={e => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">Minutes</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Password Mandatory Rotation"
                  type="number"
                  value={settings.passwordRotationDays}
                  onChange={e => handleChange('passwordRotationDays', parseInt(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">Days</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Max Failed Attempts (Account Lockout)"
                  type="number"
                  value={settings.maxFailedLoginAttempts}
                  onChange={e => handleChange('maxFailedLoginAttempts', parseInt(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">Attempts</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                    <FormControlLabel
                      control={<Switch checked={settings.requireMfa} onChange={e => handleChange('requireMfa', e.target.checked)} color="primary" />}
                      label={<Typography fontWeight={600}>Enforce Multi-Factor Authentication (MFA)</Typography>}
                    />
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}>
                    <FormControlLabel
                      control={<Switch checked={settings.ipGeoFencing} onChange={e => handleChange('ipGeoFencing', e.target.checked)} color="primary" />}
                      label={<Typography fontWeight={600}>Enable Strict IP Geo-Fencing</Typography>}
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Tab 3: Fintech & Loan Rules */}
        <TabPanel value={activeTab} index={2}>
          <Card className="glass" sx={{ p: 4, borderRadius: '24px', border: 'none', minHeight: 500, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight={700} mb={4} color="primary.main">Lending & Credit Scoring Parameters</Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Default Processing Fee"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={settings.defaultProcessingFeePct}
                  onChange={e => handleChange('defaultProcessingFeePct', parseFloat(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Maximum Allowable APR"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={settings.maxAllowedApr}
                  onChange={e => handleChange('maxAllowedApr', parseFloat(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">% p.a.</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Minimum CIBIL Score Threshold"
                  type="number"
                  value={settings.minCibilThreshold}
                  onChange={e => handleChange('minCibilThreshold', parseInt(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">Score</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Late Payment Daily Penalty Rate"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={settings.latePaymentDailyPenaltyPct}
                  onChange={e => handleChange('latePaymentDailyPenaltyPct', parseFloat(e.target.value) || 0)}
                  InputProps={{ endAdornment: <InputAdornment position="end">% / day</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
            </Grid>
          </Card>
        </TabPanel>

        {/* Tab 4: Notifications & Gateways */}
        <TabPanel value={activeTab} index={3}>
          <Card className="glass" sx={{ p: 4, borderRadius: '24px', border: 'none', minHeight: 500, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight={700} mb={4} color="primary.main">Communication & Webhook Gateways</Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="SMS Gateway Service Provider"
                  value={settings.smsGatewayProvider}
                  onChange={e => handleChange('smsGatewayProvider', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                >
                  <MenuItem value="Msg91">Msg91 Premium Cloud</MenuItem>
                  <MenuItem value="Twilio">Twilio Global Gateway</MenuItem>
                  <MenuItem value="AWS SNS">AWS Simple Notification Service</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email SMTP Gateway Host"
                  value={settings.emailSmtpHost}
                  onChange={e => handleChange('emailSmtpHost', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email SMTP Port"
                  type="number"
                  value={settings.emailSmtpPort}
                  onChange={e => handleChange('emailSmtpPort', parseInt(e.target.value) || 0)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Core Banking Webhook Secret Key"
                  value={settings.webhookSecretKey}
                  onChange={e => handleChange('webhookSecretKey', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px' } }}
                />
              </Grid>
              <Grid size={12}>
                <Box sx={{ p: 2.5, bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                  <FormControlLabel
                    control={<Switch checked={settings.broadcastDailyLedger} onChange={e => handleChange('broadcastDailyLedger', e.target.checked)} color="primary" />}
                    label={<Typography fontWeight={600}>Automated Daily Loan Ledger Broadcast to Admin Accounts</Typography>}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default SettingsDashboard;
