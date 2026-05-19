import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  styled
} from '@mui/material';

// third-party
import { motion } from 'framer-motion';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import dashboardService from 'services/dashboard.service';
import useAuth from 'hooks/useAuth';

// assets
import { IconActivity, IconClock } from '@tabler/icons-react';

// styled components
const IconWrapper = styled(Box)(({ color }: { color: string }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${color}15`,
  color: color
}));

// ==============================|| ACTIVITY LOGS PAGE ||============================== //

const ActivityLogs: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await dashboardService.getActivities(50);
        if (response.success) {
          setActivities(response.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress size={40} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  const roleValue = user?.role as any;
  const roleName = typeof roleValue === 'string' ? roleValue : roleValue?.key || roleValue?.slug || roleValue?.name || '';
  const isSuperAdmin = roleName.toLowerCase() === 'super_admin';
  const headingText = isSuperAdmin ? 'System Activity Logs' : 'My Activity Logs';

  return (
    <MainCard title={headingText}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            {isSuperAdmin 
              ? "Comprehensive audit trail of all system governance events and administrative actions."
              : "Audit trail of your personal activity events and operations."}
          </Typography>
        </Box>
        
        <Card sx={{ p: 0, overflow: 'hidden', border: '1px solid', borderColor: theme.palette.divider }}>
          <List disablePadding>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <ListItem
                  key={activity._id}
                  divider={index !== activities.length - 1}
                  sx={{
                    py: 2.5,
                    px: 3,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' }
                  }}
                >
                  <ListItemIcon>
                    <IconWrapper
                      color={activity.action.includes('LOGIN') ? theme.palette.success.main : theme.palette.primary.main}
                    >
                      <IconActivity size={20} />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.details}
                    primaryTypographyProps={{
                      variant: 'subtitle1',
                      fontWeight: 700
                    }}
                    secondary={
                      <Stack direction="row" spacing={2} mt={0.5} alignItems="center">
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          IP: {activity.ipAddress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <IconClock size={12} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {new Date(activity.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                    secondaryTypographyProps={{
                      component: 'div'
                    }}
                  />
                  <Chip
                    label={activity.action}
                    size="small"
                    sx={{
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      bgcolor: 'rgba(0,0,0,0.03)',
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box p={4} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No activity logs found.
                </Typography>
              </Box>
            )}
          </List>
        </Card>
      </motion.div>
    </MainCard>
  );
};

export default ActivityLogs;
