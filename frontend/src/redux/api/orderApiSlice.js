import { apiSlice } from "./apiSlice";
import { ORDERS_URL, RAZORPAY_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
        credentials: 'include',
      }),
    }),

    createRazorpayOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/create-razorpay-order`,
        method: 'POST',
        body: { orderId },
        credentials: 'include',
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        credentials: 'include',
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
        credentials: 'include',
      }),
    }),

    getRazorpayClientId: builder.query({
      query: () => ({
        url: RAZORPAY_URL,
        credentials: 'include',
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
        credentials: 'include',
      }),
    }),

    getTotalOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-orders`,
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    getTotalSales: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales`,
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),

    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales-by-date`,
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetRazorpayClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useCreateRazorpayOrderMutation,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
} = orderApiSlice;