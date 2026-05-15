import { alpha } from '@mui/material/styles';

export const withAlpha = (color: string, value: number) => {
  try {
    return alpha(color, value);
  } catch (e) {
    return color;
  }
};

export const extendPaletteWithChannels = (palette: any) => {
  // Minimal implementation to prevent errors while keeping the design
  return palette;
};
