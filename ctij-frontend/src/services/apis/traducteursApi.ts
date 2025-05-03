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
      { search: string; code_dept: string; langue: string }
    >({
      query: ({ search, code_dept, langue }) =>
        `/interpretes/filter?keyword=${encodeURIComponent(search)}&departement=${code_dept}&langue=${langue}`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
    }),
    getAlltraducteurs: builder.query({
      query: () => `/interpretes`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
      providesTags: ["traducteurs"], // <-- Add this
    }),

    getTradStats: builder.query({
      query: () => `/interpretes/stats`,
      transformResponse: (response: any) => ({
        traducteurs: response,
      }),
      providesTags: ["traducteurs"], // <-- Add this
    }),

    deleteTraducteur: builder.mutation({
      query: ({ id }) => ({
        url: `/interpretes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["traducteurs"], // <-- Add this
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
