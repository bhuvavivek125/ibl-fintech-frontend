import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';

// project imports
import UpgradePlanCard from './UpgradePlanCard';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useAuth from 'hooks/useAuth';
import useAdminAuth from 'hooks/useAdminAuth';
import { useModuleAccess } from 'hooks/useModuleAccess';
import { adminLogout } from 'api/admin-auth';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: adminContextLogout, user: adminUser } = useAdminAuth();
  const { canPerform } = useModuleAccess();
  const [open, setOpen] = useState(false);

  const currentUser = adminUser;
  const anchorRef = useRef<any>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the admin logout API
      const response = await adminLogout();

      // Clear all authentication-related data from localStorage
      localStorage.removeItem('adminPermissions');
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Clear session storage if used
      sessionStorage.clear();

      // Update the AdminAuthContext state
      adminContextLogout();

      // Close the menu
      setOpen(false);

      // Show success message
      enqueueSnackbar(`Logged out successfully at ${new Date(response.data.logoutAt).toLocaleString()}`, {
        variant: 'success',
        autoHideDuration: 3000
      });

      // Redirect to admin login page after a short delay
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 1000);
    } catch (err: any) {
      console.error('Logout error:', err);

      // Still clear local data on error
      localStorage.removeItem('adminPermissions');
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // Still update context on error
      adminContextLogout();

      const errorMessage = err?.response?.data?.message || 'Logout failed. Redirecting to login page.';
      enqueueSnackbar(errorMessage, {
        variant: 'warning',
        autoHideDuration: 3000
      });

      // Still redirect even on error after a short delay
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
        icon={
          <Avatar
            src={User1}
            alt="user-images"
            sx={{ typography: 'mediumAvatar', margin: '8px 0 8px 8px !important', cursor: 'pointer' }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="h4">Good Morning,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {currentUser?.name || 'Admin'}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">{adminUser ? 'Admin' : 'Project Admin'}</Typography>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        slotProps={{ input: { 'aria-label': 'weight' } }}
                      />
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <UpgradePlanCard />
                      <Divider />
                      <Card sx={{ bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.800' }), my: 2 }}>
                        <CardContent>
                          <Stack sx={{ gap: 3 }}>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1">Start DND Mode</Typography>
                              <Switch color="primary" checked={sdm} onChange={(e) => setSdm(e.target.checked)} name="sdm" size="small" />
                            </Stack>
                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1">Allow Notifications</Typography>
                              <Switch checked={notification} onChange={(e) => setNotification(e.target.checked)} name="sdm" size="small" />
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        {/* Account Settings - Show if user has settings access */}
                        {canPerform('user-settings', 'read') && (
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 0, '/apps/user/account-profile/profile1')
                            }
                          >
                            <ListItemIcon>
                              <IconSettings stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="account-settings" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        )}

                        {/* Social Profile - Show if user has profile access */}
                        {canPerform('user-profile', 'read') && (
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 1}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 1, '/apps/user/social-profile/posts')
                            }
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">
                                    <FormattedMessage id="social-profile" />
                                  </Typography>
                                  <Chip
                                    slotProps={{
                                      label: { sx: { mt: 0.25, ...theme.applyStyles('dark', { color: 'background.default' }) } }
                                    }}
                                    label="02"
                                    variant="filled"
                                    size="small"
                                    color="warning"
                                  />
                                </Stack>
                              }
                            />
                          </ListItemButton>
                        )}

                        {/* Logout - Always show */}
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">{isLoggingOut ? 'Logging out...' : <FormattedMessage id="logout" />}</Typography>
                            }
                          />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
