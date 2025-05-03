import { configureStore } from "@reduxjs/toolkit";
import authentication from "../services/reducers/authentication";
import { traducteursApi } from "@/services/apis/traducteursApi";

export const store = configureStore({
  reducer: {
    authentication: authentication,
    [traducteursApi.reducerPath]: traducteursApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).concat(traducteursApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
