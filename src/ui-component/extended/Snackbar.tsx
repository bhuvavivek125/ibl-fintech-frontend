import MuiSnackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'store';
import { closeSnackbar } from 'store/slices/snackbar';

export default function Snackbar() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => dispatch(closeSnackbar())}
    >
      <Alert severity={severity} variant="filled">{message}</Alert>
    </MuiSnackbar>
  );
}
