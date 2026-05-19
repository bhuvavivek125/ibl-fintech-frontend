import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

// third-party
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import dashboardService from 'services/dashboard.service';
import { gridSpacing } from 'store/constant';

// assets
import {
  IconUsers,
  IconUserCheck,
  IconUserExclamation,
  IconActivity,
  IconTrendingUp,
  IconClock
} from '@tabler/icons-react';

// styled components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  padding: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
  }
}));

const IconWrapper = styled(Box)(({ color }: { color: string }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${color}15`,
  color: color,
}));

// ==============================|| ADMIN DASHBOARD ||============================== //

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, chartsRes] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getCharts()
        ]);
        if (overviewRes.success) setStats(overviewRes.data);
        if (chartsRes.success) setChartData(chartsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress size={40} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  const growthChartOptions: any = {
    chart: { id: 'growth-chart', type: 'area', toolbar: { show: false }, animations: { enabled: true } },
    xaxis: {
      categories: chartData?.userGrowth?.labels || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    colors: [theme.palette.primary.main],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    dataLabels: { enabled: false },
    tooltip: { x: { show: false }, marker: { show: false } }
  };

  const growthChartSeries = [{
    name: 'Identity Flow',
    data: chartData?.userGrowth?.data || []
  }];

  const ecosystemOptions: any = {
    labels: ['Verified', 'Pending', 'Action Required'],
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Assets',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.palette.text.secondary
            },
            value: {
              fontSize: '24px',
              fontWeight: 800,
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 }
  };

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={6}>
          <Box>
            <Typography variant="h1" fontWeight={900} letterSpacing="-1px" sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.8rem', sm: '2.5rem' }
            }}>
              Enterprise Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={500} mt={1}>
              Strategic Intelligence Hub • Real-time Monitoring
            </Typography>
          </Box>
          <Chip
            label="SYSTEM: OPTIMAL"
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              color: theme.palette.success.main,
              fontWeight: 800,
              borderRadius: '10px',
              border: `1px solid ${theme.palette.success.light}`,
              px: 1
            }}
          />
        </Stack>
      </motion.div>

      <Grid container spacing={4} mb={6}>
        {[
          { title: 'Identity Registry', value: stats?.totalUsers, icon: IconUsers, color: theme.palette.primary.main, trend: '+12%' },
          { title: 'Verified Assets', value: stats?.activeUsers, icon: IconUserCheck, color: theme.palette.success.main, trend: 'Optimal' },
          { title: 'Security Actions', value: stats?.inactiveUsers, icon: IconUserExclamation, color: theme.palette.warning.main, trend: '2 Pending' },
          { title: 'Growth Velocity', value: '98.4%', icon: IconTrendingUp, color: theme.palette.secondary.main, trend: '+2.4%' }
        ].map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <IconWrapper color={item.color}>
                    <item.icon size={24} />
                  </IconWrapper>
                  <Typography variant="caption" fontWeight={800} sx={{ color: item.color }}>{item.trend}</Typography>
                </Stack>
                <Box mt={3}>
                  <Typography variant="h2" fontWeight={900}>{item.value || 0}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>{item.title}</Typography>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard sx={{ height: '100%', p: 0, overflow: 'hidden' }}>
              <Box p={3}>
                <Typography variant="h4" fontWeight={800}>Provisioning Velocity</Typography>
                <Typography variant="caption" color="text.secondary">Identity flow metrics for the current cycle</Typography>
              </Box>
              <Box sx={{ mt: -2 }}>
                <Chart options={growthChartOptions} series={growthChartSeries} type="area" height={320} />
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard sx={{ height: '100%' }}>
              <Typography variant="h4" fontWeight={800} mb={4}>Asset Ecosystem</Typography>
              <Chart
                options={ecosystemOptions}
                series={[stats?.activeUsers || 0, stats?.inactiveUsers || 0, 2]}
                type="donut"
                height={280}
              />
              <Stack spacing={2} mt={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                    <Typography variant="body2" fontWeight={600}>Verified</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={800}>{stats?.activeUsers}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.warning.main }} />
                    <Typography variant="body2" fontWeight={600}>Pending</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={800}>{stats?.inactiveUsers}</Typography>
                </Box>
              </Stack>
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>

      <Box mt={6}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Typography variant="h4" fontWeight={800} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconClock size={24} color={theme.palette.primary.main} />
            Live Governance Stream
          </Typography>
          <GlassCard sx={{ p: 0, overflow: 'hidden' }}>
            <List disablePadding>
              {stats?.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                <ListItem key={activity._id} divider={index !== 4} sx={{ py: 3, px: 4, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.02)' } }}>
                  <ListItemIcon>
                    <IconWrapper color={activity.action.includes('LOGIN') ? theme.palette.success.main : theme.palette.primary.main}>
                      <IconActivity size={20} />
                    </IconWrapper>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight={800}>{activity.details}</Typography>}
                    secondary={
                      <Stack direction="row" spacing={2} mt={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{activity.ipAddress}</Typography>
                        <Typography variant="caption" color="text.secondary">•</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{new Date(activity.createdAt).toLocaleTimeString()}</Typography>
                      </Stack>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Chip
                    label={activity.action}
                    size="small"
                    sx={{ borderRadius: '8px', fontWeight: 800, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </GlassCard>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
