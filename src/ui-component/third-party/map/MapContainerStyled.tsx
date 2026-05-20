import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


const MapContainerStyled = styled(Box)({
  zIndex: 0,
  height: 576,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 4,
  '& .maplibregl-ctrl-logo, .maplibregl-ctrl-bottom-right': {
    display: 'none'
  }
});

export default MapContainerStyled;
