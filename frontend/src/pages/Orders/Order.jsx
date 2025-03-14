import { Link } from "react-router-dom";


import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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



        // key: razorpay.clientId,
        key:"rzp_test_yo2PnQeOMGUAU5",              //////not to add on git



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
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
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

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>₹ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>₹ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>

        {!order.isPaid && (
          <div className="mt-4">
            {loadingPay && <Loader />}
            {loadingRazorpay ? (
              <Loader />
            ) : (
              <button
                onClick={handleRazorpayPayment}
                className="bg-pink-500 text-white w-full py-2 rounded"
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
              className="bg-pink-500 text-white w-full py-2 rounded"
              onClick={() => deliverOrder(orderId)}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;



