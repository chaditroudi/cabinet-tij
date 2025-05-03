import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../config/store";
import { logout, refreshAccessToken } from "../services/reducers/authentication";

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const { dispatch, getState } = api;
  const state = getState() as RootState;

  // Get access token
  let accessToken =
    localStorage.getItem("accessToken") || state.authentication.accessToken;

  // Use fetchBaseQuery with proper prepareHeaders
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // If token is expired, try to refresh
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    try {
      const refreshResult = await dispatch(refreshAccessToken()).unwrap();
      if (refreshResult?.accessToken) {
        accessToken = refreshResult.accessToken;
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (error) {
      dispatch(logout());
      return result;
    }
  }

  return result;
};

export default baseQuery;
