// import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../constants";

// const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ["Product", "Order", "User", "Category"],
//   endpoints: () => ({}),
// });



import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
});

// Add request/response logging
const baseQueryWithLogging = async (args, api, extraOptions) => {
  console.log('Making request:', {
    url: args.url,
    method: args.method,
    headers: args.headers,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error('Request failed:', {
      status: result.error.status,
      data: result.error.data,
    });
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: (builder) => ({}),
});