import { createSlice } from '@reduxjs/toolkit';

import { MenuProps } from 'types/menu';

const initialState: MenuProps = {
  isDashboardDrawerOpened: true
};

const slice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // TOGGLE DRAWER
    openDrawer(state) {
      state.isDashboardDrawerOpened = true;
    },

    closeDrawer(state) {
      state.isDashboardDrawerOpened = false;
    },

    // Set drawer state
    setDrawerOpen(state, action) {
      state.isDashboardDrawerOpened = action.payload;
    }
  }
});

export default slice.reducer;

export const { openDrawer, closeDrawer, setDrawerOpen } = slice.actions;
