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
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('userToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Add request/response logging
const baseQueryWithLogging = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  
  console.log('Making request:', {
    url,
    method: args.method,
    body: args.body ? JSON.stringify(args.body).substring(0, 200) + '...' : undefined, // Truncate for readability
  });

  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
      console.error('Request failed:', {
        url,
        status: result.error.status,
        data: result.error.data,
        headers: result.meta?.response?.headers ? Object.fromEntries(result.meta.response.headers) : {},
      });
    } else {
      console.log('Request successful:', {
        url,
        result: result.data ? (typeof result.data === 'object' ? 'data received' : result.data) : 'no data',
      });
    }

    return result;
  } catch (err) {
    console.error('API call exception:', err);
    return { error: { status: 'FETCH_ERROR', error: err.message } };
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});