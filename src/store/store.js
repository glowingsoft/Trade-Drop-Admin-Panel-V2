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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

// Action to reset all API caches
export const resetApiState = createAction('api/resetApiState');

// Create a persisted reducer for the user slice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store with the persisted reducer for the user slice
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
      badgesApi.middleware
    ),
});

// Initialize Redux Persist
export const persistor = persistStore(store);

// Setup listeners
setupListeners(store.dispatch);

// import { configureStore, createAction } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { authApi } from './Reducer/auth';
// import userReducer from './slices/userSlice';
// import { walletsApi } from './Reducer/wallets-api';
// import { transactionsApi } from './Reducer/transactions-api';
// import { categoriesApi } from './Reducer/categories-api';

// const persistConfig = {
//   key: 'root',
//   storage,
//   // whitelist: ['user'],
// };

// export const resetStore = createAction('RESET_STORE');

// // Create a persisted reducer for the user slice
// const persistedUserReducer = persistReducer(persistConfig, userReducer);

// // Create the Redux store with the persisted reducer for the user slice
// export const store = configureStore({
//   reducer: {
//     [categoriesApi.reducerPath]: categoriesApi.reducer,
//     [transactionsApi.reducerPath]: transactionsApi.reducer,
//     [walletsApi.reducerPath]: walletsApi.reducer,
//     [authApi.reducerPath]: authApi.reducer,
//     user: persistedUserReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
//       },
//     }).concat(authApi.middleware,
//       walletsApi.middleware, transactionsApi.middleware, categoriesApi.middleware),
// });

// // Initialize Redux Persist
// export const persistor = persistStore(store);

// // Setup listeners
// setupListeners(store.dispatch);
