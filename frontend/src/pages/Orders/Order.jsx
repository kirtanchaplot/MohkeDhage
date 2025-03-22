

// //WITH MARK LOGIC BUT IMAGE ISSUE
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import Messsage from "../../components/Message";
// import Loader from "../../components/Loader";
// import {
//   useDeliverOrderMutation,
//   useGetOrderDetailsQuery,
//   usePayOrderMutation,
//   useGetRazorpayClientIdQuery,
//   useCreateRazorpayOrderMutation,
// } from "../../redux/api/orderApiSlice";

// const Order = () => {
//   const { id: orderId } = useParams();
//   const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
//   const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
//   const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
//   const { userInfo } = useSelector((state) => state.auth);
//   const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

//   const { data: razorpay, isLoading: loadingRazorpay, error: errorRazorpay } =
//     useGetRazorpayClientIdQuery();

//   useEffect(() => {
//     if (!errorRazorpay && !loadingRazorpay && razorpay?.clientId) {
//       console.log("Razorpay Key Loaded:", razorpay.clientId);
//     }
//   }, [razorpay, errorRazorpay, loadingRazorpay]);

//   const handleRazorpayPayment = async () => {
//     try {
//       if (!window.Razorpay) {
//         toast.error("Razorpay SDK failed to load");
//         return;
//       }

//       // Step 1: Create a Razorpay order on the server
//       const response = await createRazorpayOrder(orderId).unwrap();
      
//       // Step 2: Configure Razorpay payment
//       const options = {
//         key: "rzp_test_yo2PnQeOMGUAU5",
//         amount: response.amount,
//         currency: response.currency,
//         name: "MohkeDhage",
//         description: `Order #${order._id}`,
//         order_id: response.id,
//         handler: async function (response) {
//           // Step 3: Handle successful payment
//           try {
//             await payOrder({ 
//               orderId, 
//               details: {
//                 paymentId: response.razorpay_payment_id,
//                 orderId: response.razorpay_order_id,
//                 signature: response.razorpay_signature
//               } 
//             });
//             refetch();
//             toast.success("Payment Successful");
//           } catch (error) {
//             toast.error(error?.data?.message || error.message);
//           }
//         },
//         prefill: {
//           name: order.user?.username || "",
//           email: order.user?.email || "",
//         },
//         theme: { color: "#f50057" },
//       };

//       // Step 4: Initialize Razorpay
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       toast.error(error?.data?.message || error.message);
//       console.error("Razorpay Error:", error);
//     }
//   };
//   return isLoading ? (
//     <Loader />
//   ) : error ? (
//     <Messsage variant="danger">{error.data.message}</Messsage>
//   ) : (
//     <div className="container mx-auto px-4">
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="w-full md:w-2/3">
//           <div className="border-gray-300 mt-5 pb-4 mb-5">
//             {order.orderItems.length === 0 ? (
//               <Messsage>Order is empty</Messsage>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[320px]">
//                   <thead className="border-b-2">
//                     <tr>
//                       <th className="p-2">Image</th>
//                       <th className="p-2">Product</th>
//                       <th className="p-2 text-center">Qty</th>
//                       <th className="p-2">Price</th>
//                       <th className="p-2">Total</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {order.orderItems.map((item, index) => (
//                       <tr key={index}>
//                         <td className="p-2">
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-16 h-16 object-cover rounded"
//                             onError={(e) => {
//                               console.error(`Failed to load image for ${item.name}: ${item.image}`);
//                               e.target.onerror = null;
//                               e.target.src = '/placeholder.png';
//                             }}
//                             onLoad={() => console.log(`Successfully loaded: ${item.image}`)}
//                           />
//                         </td>

//                         <td className="p-2 text-sm md:text-base">
//                           <Link to={`/product/${item.product}`}>{item.name}</Link>
//                         </td>

//                         <td className="p-2 text-center text-sm md:text-base">{item.qty}</td>
//                         <td className="p-2 text-center text-sm md:text-base">{item.price}</td>
//                         <td className="p-2 text-center text-sm md:text-base">
//                         ₹ {(item.qty * item.price).toFixed(2)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="w-full md:w-1/3">
//           <div className="mt-5 border rounded-lg p-4 bg-gray-800 shadow-md">
//             <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping Details</h2>
//             <p className="mb-3">
//               <strong className="text-pink-500">OrderRR:</strong> {order._id}
//             </p>

//             <p className="mb-3">
//               <strong className="text-pink-500">Name:</strong>{" "}
//               {order.user.username}
//             </p>

//             <p className="mb-3">
//               <strong className="text-pink-500">Email:</strong> {order.user.email}
//             </p>

//             <p className="mb-3">
//               <strong className="text-pink-500">Address:</strong>{" "}
//               {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
//               {order.shippingAddress.postalCode}, {order.shippingAddress.country}
//             </p>

//             <p className="mb-3">
//               <strong className="text-pink-500">Method:</strong>{" "}
//               {order.paymentMethod}
//             </p>

//             {order.isPaid ? (
//               <Messsage variant="success">Paid on {order.paidAt}</Messsage>
//             ) : (
//               <Messsage variant="danger">Not paid</Messsage>
//             )}
//           </div>

//           <div className="mt-6 border rounded-lg p-4 bg-gray-800 shadow-md">
//             <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center py-1">
//                 <span>Items</span>
//                 <span className="font-medium">₹ {order.itemsPrice}</span>
//               </div>
//               <div className="flex justify-between items-center py-1">
//                 <span>Shipping</span>
//                 <span className="font-medium">₹ {order.shippingPrice}</span>
//               </div>
//               <div className="flex justify-between items-center py-1">
//                 <span>Tax</span>
//                 <span className="font-medium">₹ {order.taxPrice}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 mt-2 border-t border-gray-600 text-lg font-bold">
//                 <span>Total</span>
//                 <span>₹ {order.totalPrice}</span>
//               </div>
//             </div>

//             {!order.isPaid && (
//               <div className="mt-4">
//                 {loadingPay && <Loader />}
//                 {loadingRazorpay ? (
//                   <Loader />
//                 ) : (
//                   <motion.button
//                     onClick={handleRazorpayPayment}
//                     className="bg-pink-500 text-white w-full py-3 rounded-full font-medium"
//                     disabled={loadingPay}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     Pay with Razorpay
//                   </motion.button>
//                 )}
//               </div>
//             )}

//             {loadingDeliver && <Loader />}
//             {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
//               <div className="mt-4">
//                 <motion.button
//                   type="button"
//                   className="bg-pink-500 text-white w-full py-3 rounded-full font-medium"
//                   onClick={() => deliverOrder(orderId)}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   Mark As Delivered
//                 </motion.button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;









//UPDATED REMOVED DELIVERD LOGIC
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetRazorpayClientIdQuery,
  useCreateRazorpayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

  const { data: razorpay, isLoading: loadingRazorpay, error: errorRazorpay } =
    useGetRazorpayClientIdQuery();

  useEffect(() => {
    if (!errorRazorpay && !loadingRazorpay && razorpay?.clientId) {
      console.log("Razorpay Key Loaded:", razorpay.clientId);
    }
  }, [razorpay, errorRazorpay, loadingRazorpay]);

  const handleRazorpayPayment = async () => {
    try {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Step 1: Create a Razorpay order on the server
      const response = await createRazorpayOrder(orderId).unwrap();
      
      // Step 2: Configure Razorpay payment
      const options = {
        key: "rzp_test_yo2PnQeOMGUAU5",
        amount: response.amount,
        currency: response.currency,
        name: "MohkeDhage",
        description: `Order #${order._id}`,
        order_id: response.id,
        handler: async function (response) {
          // Step 3: Handle successful payment
          try {
            await payOrder({ 
              orderId, 
              details: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              } 
            });
            refetch();
            toast.success("Payment Successful");
          } catch (error) {
            toast.error(error?.data?.message || error.message);
          }
        },
        prefill: {
          name: order.user?.username || "",
          email: order.user?.email || "",
        },
        theme: { color: "#f50057" },
      };

      // Step 4: Initialize Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.error("Razorpay Error:", error);
    }
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="border-gray-300 mt-5 pb-4 mb-5">
            {order.orderItems.length === 0 ? (
              <Messsage>Order is empty</Messsage>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                  <thead className="border-b-2">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">Product</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.orderItems.map((item, index) => {
                      // Log the image path to debug
                      console.log(`Trying to load image for ${item.name}:`, item.image);
                      
                      return (
                        <tr key={index}>
                          <td className="p-2">
                            <img
                              src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                console.error(`Failed to load image for ${item.name}: ${item.image}`);
                                e.target.onerror = null;
                                e.target.src = '/placeholder.png';
                              }}
                              onLoad={() => console.log(`Successfully loaded: ${item.image}`)}
                            />
                          </td>

                          <td className="p-2 text-sm md:text-base">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </td>

                          <td className="p-2 text-center text-sm md:text-base">{item.qty}</td>
                          <td className="p-2 text-center text-sm md:text-base">{item.price}</td>
                          <td className="p-2 text-center text-sm md:text-base">
                          ₹ {(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="mt-5 border rounded-lg p-4 bg-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping Details</h2>
            <p className="mb-3">
              <strong className="text-pink-500">Order:</strong> {order._id}
            </p>

            <p className="mb-3">
              <strong className="text-pink-500">Name:</strong>{" "}
              {order.user.username}
            </p>

            <p className="mb-3">
              <strong className="text-pink-500">Email:</strong> {order.user.email}
            </p>

            <p className="mb-3">
              <strong className="text-pink-500">Address:</strong>{" "}
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>

            <p className="mb-3">
              <strong className="text-pink-500">Method:</strong>{" "}
              {order.paymentMethod}
            </p>

            {order.isPaid ? (
              <Messsage variant="success">Paid on {order.paidAt}</Messsage>
            ) : (
              <Messsage variant="danger">Not paid</Messsage>
            )}
          </div>

          <div className="mt-6 border rounded-lg p-4 bg-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span>Items</span>
                <span className="font-medium">₹ {order.itemsPrice}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Shipping</span>
                <span className="font-medium">₹ {order.shippingPrice}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Tax</span>
                <span className="font-medium">₹ {order.taxPrice}</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-2 border-t border-gray-600 text-lg font-bold">
                <span>Total</span>
                <span>₹ {order.totalPrice}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay && <Loader />}
                {loadingRazorpay ? (
                  <Loader />
                ) : (
                  <motion.button
                    onClick={handleRazorpayPayment}
                    className="bg-pink-500 text-white w-full py-3 rounded-full font-medium"
                    disabled={loadingPay}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Pay with Razorpay
                  </motion.button>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-4">
                <motion.button
                  type="button"
                  className="bg-pink-500 text-white w-full py-3 rounded-full font-medium"
                  onClick={() => deliverOrder(orderId)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Mark As Delivered
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;