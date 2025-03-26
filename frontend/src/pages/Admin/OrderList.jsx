import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, usePayOrderMutation, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const OrderList = ({ showAdminMenu = true }) => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [payOrder] = usePayOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      imagePath = imagePath.substring(1);
    }
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    return `${backendUrl}/${imagePath}`;
  };

  const updateOrderPayment = async (orderId) => {
    try {
      await payOrder({ 
        orderId, 
        details: {
          id: Date.now(),
          status: "COMPLETED",
          update_time: new Date().toISOString(),
          payer: {}
        }
      });
      refetch();
      toast.success("Order marked as paid");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const updateOrderDelivery = async (orderId) => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Admin Menu - Only show if showAdminMenu prop is true */}
        {showAdminMenu && (
          <div className="md:w-1/4 lg:w-1/5">
            <AdminMenu />
          </div>
        )}

        {/* Main Content - Take full width if no admin menu */}
        <div className={showAdminMenu ? "md:w-3/4 lg:w-4/5" : "w-full"}>
          <div className="bg-black rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">Orders</h1>

            {isLoading ? (
              <div className="flex justify-center my-8">
                <Loader />
              </div>
            ) : error ? (
              <Message variant="error">
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <>
                {/* Desktop view: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-700">ITEMS</th>
                        <th className="text-left p-3 border-b border-gray-700">ID</th>
                        <th className="text-left p-3 border-b border-gray-700">USER</th>
                        <th className="text-left p-3 border-b border-gray-700">DATE</th>
                        <th className="text-left p-3 border-b border-gray-700">TOTAL</th>
                        <th className="text-left p-3 border-b border-gray-700">PAID</th>
                        <th className="text-left p-3 border-b border-gray-700">DELIVERED</th>
                        <th className="text-left p-3 border-b border-gray-700">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                          <td className="p-3">
                            <img
                              src={getImageUrl(order.orderItems[0]?.image)}
                              alt={order._id}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.jpg';
                              }}
                            />
                          </td>
                          <td className="p-3 text-sm">{order._id}</td>
                          <td className="p-3">{order.user ? order.user.username : "N/A"}</td>
                          <td className="p-3">{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</td>
                          <td className="p-3 font-medium">₹ {order.totalPrice}</td>
                          <td className="p-3">
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 text-xs text-center ${
                                order.isPaid ? 'bg-green-100 text-green-800' : 'bg-pink-100 text-pink-800'
                              } rounded-full`}>
                                {order.isPaid ? 'Completed' : 'Pending'}
                              </span>
                              {!order.isPaid && (
                                <button
                                  onClick={() => updateOrderPayment(order._id)}
                                  className="px-2 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 text-xs text-center ${
                                order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-pink-100 text-pink-800'
                              } rounded-full`}>
                                {order.isDelivered ? 'Completed' : 'Pending'}
                              </span>
                              {!order.isDelivered && order.isPaid && (
                                <button
                                  onClick={() => updateOrderDelivery(order._id)}
                                  className="px-2 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600"
                                >
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Link to={`/order/${order._id}`}>
                              <button className="px-3 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm">
                                Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view: Cards */}
                <div className="md:hidden space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={getImageUrl(order.orderItems[0]?.image)}
                          alt={order._id}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <div>
                          <div className="font-medium">
                            {order.user ? order.user.username : "N/A"}
                          </div>
                          <div className="text-sm text-gray-400">
                            {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="text-gray-400">Order ID:</div>
                        <div className="truncate">{order._id}</div>
                        
                        <div className="text-gray-400">Total:</div>
                        <div className="font-medium">₹ {order.totalPrice}</div>
                        
                        <div className="text-gray-400">Payment:</div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-2 py-1 text-xs ${
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-pink-100 text-pink-800'
                          } rounded-full inline-block text-center`}>
                            {order.isPaid ? 'Completed' : 'Pending'}
                          </span>
                          {!order.isPaid && (
                            <button
                              onClick={() => updateOrderPayment(order._id)}
                              className="px-2 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                        
                        <div className="text-gray-400">Delivery:</div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-2 py-1 text-xs ${
                            order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-pink-100 text-pink-800'
                          } rounded-full inline-block text-center`}>
                            {order.isDelivered ? 'Completed' : 'Pending'}
                          </span>
                          {!order.isDelivered && order.isPaid && (
                            <button
                              onClick={() => updateOrderDelivery(order._id)}
                              className="px-2 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <Link to={`/order/${order._id}`}>
                        <button className="w-full py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm">
                          View Details
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
                
                {orders.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No orders found.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;














