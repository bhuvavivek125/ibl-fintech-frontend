import { styled } from '@mui/material/styles';
import { drawerWidth } from 'store/constant';

interface MainContentStyledProps {
    open: boolean;
}

const MainContentStyled = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainContentStyledProps>(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: '20px',
        width: '100%',
        minHeight: 'calc(100vh - 88px)',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: `-${drawerWidth}px`,
        [theme.breakpoints.up('md')]: {
            marginLeft: open ? 0 : `-${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px',
            padding: '16px',
            width: '100%'
        }
    })
);

export default MainContentStyled;
