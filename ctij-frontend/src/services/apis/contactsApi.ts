import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "../../config/baseQuery";

// Create the API slice
export const contactsApi = createApi({
  reducerPath: "contactsApi",
  tagTypes: ["contacts"],
  baseQuery,
  endpoints: (builder) => ({
    getContacts: builder.query<
      { contacts: any[] },
      { search: string; code_dept: string; langue: string }
    >({
      query: ({ search, code_dept, langue }) =>
        `/interpretes/filter?keyword=${encodeURIComponent(search)}&departement=${code_dept}&langue=${langue}`,
      transformResponse: (response: any) => ({
        contacts: response,
      }),
    }),
    getAllContacts: builder.query({
      query: () => `/interpretes`,
      transformResponse: (response: any) => ({
        contacts: response,
      }),
      providesTags: ["contacts"], // <-- Add this
    }),

    deleteTraducteur: builder.mutation({
      query: ({ id }) => ({
        url: `/interpretes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contacts"], // <-- Add this
    }),
    saveTraducteur: builder.mutation({
      query: (data) => ({
        url: "/interpretes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contacts"],
    }),
    updateInterprete: builder.mutation({
      query: ({ id, data }) => ({
        url: `/interpretes/${id}`,
        method: "PUT", // or "PATCH" if your backend supports partial updates
        body: data,
      }),
      invalidatesTags: ["contacts"], // adjust this if needed
    }),
  }),
});

export const {
  useUpdateInterpreteMutation,
  useSaveTraducteurMutation,
  useLazyGetContactsQuery,
  useGetAllContactsQuery,
  useDeleteTraducteurMutation,
} = contactsApi;
