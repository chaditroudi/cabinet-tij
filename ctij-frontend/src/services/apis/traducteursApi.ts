import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "../../config/baseQuery";

// Create the API slice
export const traducteursApi = createApi({
  reducerPath: "traducteursApi",
  tagTypes: ["traducteurs"],
  baseQuery,
  endpoints: (builder) => ({
    getTraducteurs: builder.query<
      { traducteurs: any[] },
      {
        search: string;
        region: string;
        langue: string;
        assermente: boolean;
        expert: boolean;
      }
    >({
      query: ({ search, region, langue,assermente,expert }) =>
        `/interpretes/filter?keyword=${encodeURIComponent(search)}&region=${region}&langue=${langue}&assermente=${assermente}&expert=${expert}`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
    }),
    getAlltraducteurs: builder.query({
      query: ({ page = 1, keyword = "" }) =>
        `/interpretes/?page=${page}&keyword=${keyword}`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
      providesTags: ["traducteurs"],
    }),

    getTradStats: builder.query({
      query: () => `/interpretes/stats`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
      providesTags: ["traducteurs"],
    }),

    deleteTraducteur: builder.mutation({
      query: ({ id }) => ({
        url: `/interpretes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["traducteurs"],
    }),
    saveTraducteur: builder.mutation({
      query: (data) => ({
        url: "/interpretes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["traducteurs"],
    }),
    updateTraducteur: builder.mutation({
      query: ({ id, data }) => ({
        url: `/interpretes/${id}`,
        method: "PUT", // or "PATCH" if your backend supports partial updates
        body: data,
      }),
      invalidatesTags: ["traducteurs"], // adjust this if needed
    }),
  }),
});

export const {
  useUpdateTraducteurMutation,
  useSaveTraducteurMutation,
  useLazyGetTraducteursQuery,
  useGetAlltraducteursQuery,
  useDeleteTraducteurMutation,
  useGetTradStatsQuery,
} = traducteursApi;
