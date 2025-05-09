import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "../../config/baseQuery";

// Create the API slice
export const languesApi = createApi({
  reducerPath: "languesApi",
  tagTypes: ["langues"],
  baseQuery,
  endpoints: (builder) => ({
    getAlllangues: builder.query({
      query: () => `/langues`,
      transformResponse: (response: any) => ({
        langues: response,
      }),
      providesTags: ["langues"], // <-- Add this
    }),

    deletelangue: builder.mutation({
      query: ({ id }) => ({
        url: `/langues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["langues"], // <-- Add this
    }),
    savelangue: builder.mutation({
      query: (data) => ({
        url: "/langues",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["langues"],
    }),
    updatelangue: builder.mutation({
      query: ({ id, data }) => ({
        url: `/langues/${id}`,
        method: "PUT", // or "PATCH" if your backend supports partial updates
        body: data,
      }),
      invalidatesTags: ["langues"], // adjust this if needed
    }),
  }),
});

export const {
  useUpdatelangueMutation,
  useSavelangueMutation,
  useGetAlllanguesQuery,
  useDeletelangueMutation,
} = languesApi;
