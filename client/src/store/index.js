import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice';

export default configureStore({
  reducer: {
    rooms: appReducer,
  },
});
