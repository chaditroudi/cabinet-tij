import { configureStore } from "@reduxjs/toolkit";
import authentication from "../services/reducers/authentication";
import { contactsApi } from "@/services/apis/contactsApi";

export const store = configureStore({
  reducer: {
    authentication: authentication,
    [contactsApi.reducerPath]: contactsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).concat(contactsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
