import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { dispatch } from '../index';
import { IMailSettings } from 'api/mail-settings';

import { DefaultRootStateProps } from 'types';


export interface MailSettingsState {
  data: IMailSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: MailSettingsState = {
  data: null,
  loading: false,
  error: null
};

const slice = createSlice({
  name: 'mailSettings',
  initialState,
  reducers: {
    // SET LOADING
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // HAS ERROR
    hasError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // GET MAIL SETTINGS SUCCESS
    getMailSettingsSuccess(state, action: PayloadAction<IMailSettings | null>) {
      state.data = action.payload;
      state.error = null;
    },

    // SAVE MAIL SETTINGS SUCCESS
    saveMailSettingsSuccess(state, action: PayloadAction<IMailSettings>) {
      state.data = action.payload;
      state.error = null;
    },

    // CLEAR MAIL SETTINGS
    clearMailSettings(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    }
  }
});

export default slice.reducer;


// Import API functions
import { saveMailSettings } from 'api/mail-settings';

export function updateMailSettings(formData: FormData) {
  return async () => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await saveMailSettings(formData);
      dispatch(slice.actions.saveMailSettingsSuccess(response.data));
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save mail settings';
      dispatch(slice.actions.hasError(errorMessage));
      throw error;
    } finally {
      dispatch(slice.actions.setLoading(false));
    }
  };
}
