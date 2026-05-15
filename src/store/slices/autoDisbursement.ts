// third party
import { createSlice } from '@reduxjs/toolkit';

// ==============================|| SLICE - AUTO DISBURSEMENT ||============================== //

interface AutoDisbursementState {
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AutoDisbursementState = {
  isEnabled: false,
  isLoading: false,
  error: null
};

const slice = createSlice({
  name: 'autoDisbursement',
  initialState,
  reducers: {
    // START TOGGLE
    startToggleAutoDisbursement(state) {
      state.isLoading = true;
      state.error = null;
    },

    // TOGGLE SUCCESS
    toggleAutoDisbursementSuccess(state, action) {
      state.isEnabled = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // TOGGLE ERROR
    toggleAutoDisbursementError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // SET AUTO DISBURSEMENT STATUS
    setAutoDisbursementStatus(state, action) {
      state.isEnabled = action.payload;
    },

    // RESET ERROR
    resetError(state) {
      state.error = null;
    }
  }
});

export default slice.reducer;

export const {
  startToggleAutoDisbursement,
  toggleAutoDisbursementSuccess,
  toggleAutoDisbursementError,
  setAutoDisbursementStatus,
  resetError
} = slice.actions;
