import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import getImageUrl from "../../Utils/imageUrl";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetRazorpayClientIdQuery,
  useCreateRazorpayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    // Skip the query if no user is logged in
    skip: !userInfo,
    // Retry on error
    refetchOnError: true
  });
  
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

  const { data: razorpay, isLoading: loadingRazorpay, error: errorRazorpay } =
    useGetRazorpayClientIdQuery();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userInfo) {
      toast.error("Please log in to view this order");
      navigate('/login?redirect=/order/' + orderId);
    }
  }, [userInfo, navigate, orderId]);

  // Handle authentication errors
  useEffect(() => {
    if (error && (error.status === 401 || error.data?.message?.includes("token"))) {
      toast.error("Your session has expired. Please log in again.");
      dispatch(logout());
      navigate('/login');
    }
  }, [error, navigate, dispatch]);

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

      if (!userInfo) {
        toast.error("Please login to make a payment");
        navigate('/login');
        return;
      }

      // Step 1: Create a Razorpay order on the server
      toast.info("Preparing payment...");
      const response = await createRazorpayOrder(orderId).unwrap();
      
      // Step 2: Configure Razorpay payment
      const options = {
        key: "rzp_test_yo2PnQeOMGUAU5", // Using the provided key directly
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
            console.error("Payment completion error:", error);
            toast.error(error?.data?.message || error.message || "Payment failed to process");
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
      rzp.on('payment.failed', function (response){
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error(error?.data?.message || error.message || "Failed to initialize payment");
      
      // If we get an auth error, redirect to login
      if (error?.status === 401 || error?.data?.message?.includes("token")) {
        toast.error("Please log in to continue");
        dispatch(logout());
        navigate('/login');
      }
    }
  };

  if (!userInfo) {
    return <Message>Please log in to view this order</Message>;
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error.data?.message || error.error || "Error loading order"}
    </Message>
  ) : !order ? (
    <Message variant="danger">Order not found</Message>
  ) : (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="border-gray-300 mt-5 pb-4 mb-5">
            {!order.orderItems || order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
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
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.png';
                            }}
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
                    ))}
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
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not paid</Message>
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
                  <button
                    onClick={handleRazorpayPayment}
                    className="bg-pink-500 text-white w-full py-3 rounded-full font-medium hover:bg-pink-600 transition-colors"
                    disabled={loadingPay}
                  >
                    Pay with Razorpay
                  </button>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-pink-500 text-white w-full py-3 rounded-full font-medium hover:bg-pink-600 transition-colors"
                  onClick={() => deliverOrder(orderId)}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;