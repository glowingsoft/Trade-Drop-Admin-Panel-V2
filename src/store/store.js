import { configureStore, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './Reducer/auth';
import userReducer from './slices/userSlice';
import { walletsApi } from './Reducer/wallets-api';
import { categoriesApi } from './Reducer/categories-api';
import { usersApi } from './Reducer/users-api';
import { uploadApi } from './Reducer/upload-api';
import { dashboardApi } from './Reducer/dashboard-api';
import { faqsApi } from './Reducer/faqs-api';
import { settingsApi } from './Reducer/settings-api';
import { announcementsApi } from './Reducer/announcements-api';
import { dropsApi } from './Reducer/drops-api';
import { tapInsApi } from './Reducer/tapins-api';
import { badgesApi } from './Reducer/badges-api';
import { disputesApi } from './Reducer/disputes-api';
import { circlesApi } from './Reducer/circles-api';
import { eventsApi } from './Reducer/events-api';
import { reportsApi } from './Reducer/reports-api';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

export const resetApiState = createAction('api/resetApiState');

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [walletsApi.reducerPath]: walletsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [faqsApi.reducerPath]: faqsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [announcementsApi.reducerPath]: announcementsApi.reducer,
    [dropsApi.reducerPath]: dropsApi.reducer,
    [tapInsApi.reducerPath]: tapInsApi.reducer,
    [badgesApi.reducerPath]: badgesApi.reducer,
    [disputesApi.reducerPath]: disputesApi.reducer,
    [circlesApi.reducerPath]: circlesApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      walletsApi.middleware,
      categoriesApi.middleware,
      usersApi.middleware,
      uploadApi.middleware,
      dashboardApi.middleware,
      faqsApi.middleware,
      settingsApi.middleware,
      announcementsApi.middleware,
      dropsApi.middleware,
      tapInsApi.middleware,
      badgesApi.middleware,
      disputesApi.middleware,
      circlesApi.middleware,
      eventsApi.middleware,
      reportsApi.middleware
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

