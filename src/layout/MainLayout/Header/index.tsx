import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { IconMenu2 } from '@tabler/icons-react';

// project imports
import LogoSection from '../LogoSection';

export default function Header({ handleDrawerToggle }: { handleDrawerToggle: () => void }) {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ width: 228, display: 'flex', alignItems: 'center' }}>
        <LogoSection />
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: theme.palette.primary.light,
            color: theme.palette.primary.dark,
            '&:hover': {
              background: theme.palette.primary.dark,
              color: theme.palette.primary.light
            },
            cursor: 'pointer',
            ml: 2
          }}
          onClick={handleDrawerToggle}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="1.3rem" />
        </Avatar>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </>
  );
}
