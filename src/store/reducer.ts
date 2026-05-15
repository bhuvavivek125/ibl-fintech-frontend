// third party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import autoDisbursementReducer from './slices/autoDisbursement';
import mailSettingsReducer from './slices/mailSettings';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  snackbar: snackbarReducer,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'berry-'
    },
    cartReducer
  ),
  autoDisbursement: persistReducer(
    {
      key: 'autoDisbursement',
      storage,
      keyPrefix: 'berry-'
    },
    autoDisbursementReducer
  ),
  mailSettings: persistReducer(
    {
      key: 'mailSettings',
      storage,
      keyPrefix: 'berry-'
    },
    mailSettingsReducer
  ),
  kanban: kanbanReducer,
  customer: customerReducer,
  contact: contactReducer,
  product: productReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  mail: mailReducer,
  user: userReducer
});

export default reducer;
