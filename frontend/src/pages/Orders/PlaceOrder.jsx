import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import getImageUrl from "../../Utils/imageUrl";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      // First, verify authentication
      if (!userInfo) {
        toast.error("Your session has expired. Please log in again.");
        navigate('/login?redirect=/placeorder');
        return;
      }

      // Check if token exists
      const token = localStorage.getItem('userToken') || userInfo.token;
      if (!token) {
        console.error("No authentication token found");
        toast.error("Authentication issue. Please log in again.");
        navigate('/login?redirect=/placeorder');
        return;
      }

      toast.info("Processing your order...");
      
      // Log request details for debugging
      console.log("Placing order with data:", {
        items: cart.cartItems.length,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        totalPrice: cart.totalPrice,
        auth: !!token
      });
      
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      
      dispatch(clearCartItems());
      toast.success("Order placed successfully!");
      navigate(`/order/${res._id}`);
    } catch (error) {
      console.error("Place order error:", error);
      
      // Handle different error scenarios with detailed logging
      if (error.status === 401) {
        console.log("Authentication failed:", error);
        toast.error("Session expired. Please log in again");
        navigate('/login?redirect=/placeorder');
      } else if (error.status === 403) {
        toast.error("You don't have permission to place an order");
      } else if (error.status === 400) {
        toast.error(error?.data?.message || "Invalid order data");
      } else {
        toast.error(error?.data?.message || error.message || "Failed to place order. Please try again");
      }
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto px-4 mt-6">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="p-2 text-sm md:text-base">
                      <Link to={`/product/${item.product}`} className="hover:text-pink-400">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-right">{item.price.toFixed(2)}</td>
                    <td className="p-2 text-right font-medium">
                      ₹ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1 space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Shipping</h2>
              <p className="text-sm md:text-base leading-relaxed">
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Payment Method</h2>
              <p className="flex items-center">
                <strong>Method:</strong> 
                <span className="ml-2 inline-flex items-center bg-pink-500 bg-opacity-20 px-2 py-1 rounded text-pink-400">
                  {cart.paymentMethod}
                </span>
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Items:</span>
                  <span className="font-medium">₹ {cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  <span className="font-medium">₹ {cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  <span className="font-medium">₹ {cart.taxPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-700">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="font-bold text-lg text-pink-400">₹ {cart.totalPrice}</span>
                </div>
              </div>

              {error && (
                <Message variant="danger" className="mt-4">
                  {error.data?.message || error.message || 'An error occurred'}
                </Message>
              )}

              <button
                type="button"
                className="bg-pink-500 text-white py-3 px-4 rounded-full text-base font-medium w-full mt-6 hover:bg-pink-600 transition-colors"
                disabled={cart.cartItems === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>

              {isLoading && <Loader className="mt-4" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;



















