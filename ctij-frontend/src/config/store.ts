import { configureStore } from "@reduxjs/toolkit";
import authentication from "../services/reducers/authentication";
import { traducteursApi } from "@/services/apis/traducteursApi";
import { languesApi } from "@/services/apis/languesApi";

export const store = configureStore({
  reducer: {
    authentication: authentication,
    [traducteursApi.reducerPath]: traducteursApi.reducer,
    [languesApi.reducerPath]: languesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }).concat(traducteursApi.middleware,languesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
