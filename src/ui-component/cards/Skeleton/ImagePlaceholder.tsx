import Skeleton from '@mui/material/Skeleton';


export default function ImagePlaceholder({ ...others }) {
  return <Skeleton variant="rectangular" {...others} animation="wave" />;
}
