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
    const token = localStorage.getItem('userToken') || getState().auth.userInfo?.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Don't set CORS headers manually, they are set by the browser
    
    return headers;
  }
});

// Add request/response logging
const baseQueryWithLogging = async (args, api, extraOptions) => {
  console.log('Making request:', {
    url: typeof args === 'string' ? args : args.url,
    method: args.method,
    body: args.body,
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error('Request failed:', {
      status: result.error.status,
      data: result.error.data,
      url: typeof args === 'string' ? args : args.url,
    });
  } else {
    console.log('Request successful:', {
      url: typeof args === 'string' ? args : args.url,
      result: result.data,
    });
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});