import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, usePayOrderMutation, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [payOrder] = usePayOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    
    // If the image path is already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If the image path starts with a slash, remove it
    if (imagePath.startsWith('/')) {
      imagePath = imagePath.substring(1);
    }
    
    // Construct the full URL using the backend URL from environment variables
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
    <div className="flex flex-col md:flex-row">
      <div className="md:hidden">
        <AdminMenu />
      </div>
      
      <div className="w-full px-4 py-4 md:p-6">
        <div className="border-b pb-3 mb-4">
          <h1 className="text-xl font-bold">Orders</h1>
        </div>
        
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
                <thead className="bg-black-500">
                  <tr>
                    <th className="text-left p-3 border-b">ITEMS</th>
                    <th className="text-left p-3 border-b">ID</th>
                    <th className="text-left p-3 border-b">USER</th>
                    <th className="text-left p-3 border-b">DATE</th>
                    <th className="text-left p-3 border-b">TOTAL</th>
                    <th className="text-left p-3 border-b">PAID</th>
                    <th className="text-left p-3 border-b">DELIVERED</th>
                    <th className="text-left p-3 border-b">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-green-800">
                      <td className="p-3">
                        <img
                          src={getImageUrl(order.orderItems[0]?.image)}
                          alt={order._id}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
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
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          } rounded-full`}>
                            {order.isPaid ? 'Completed' : 'Pending'}
                          </span>
                          {!order.isPaid && (
                            <button
                              onClick={() => updateOrderPayment(order._id)}
                              className="px-2 py-1 text-xs bg-pink-400 text-white rounded hover:bg-blue-600"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-2">
                          <span className={`px-2 py-1 text-xs text-center ${
                            order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          } rounded-full`}>
                            {order.isDelivered ? 'Completed' : 'Pending'}
                          </span>
                          {!order.isDelivered && order.isPaid && (
                            <button
                              onClick={() => updateOrderDelivery(order._id)}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
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
                <div key={order._id} className="bg-black-100 rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={getImageUrl(order.orderItems[0]?.image)}
                      alt={order._id}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div>
                      <div className="font-medium">
                        {order.user ? order.user.username : "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="text-gray-500">Order ID:</div>
                    <div className="truncate">{order._id}</div>
                    
                    <div className="text-gray-500">Total:</div>
                    <div className="font-medium">₹ {order.totalPrice}</div>
                    
                    <div className="text-gray-500">Payment:</div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      } rounded-full inline-block text-center`}>
                        {order.isPaid ? 'Completed' : 'Pending'}
                      </span>
                      {!order.isPaid && (
                        <button
                          onClick={() => updateOrderPayment(order._id)}
                          className="px-2 py-1 text-xs bg-pink-400 text-white rounded hover:bg-blue-600"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                    
                    <div className="text-gray-500">Delivery:</div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs ${
                        order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      } rounded-full inline-block text-center`}>
                        {order.isDelivered ? 'Completed' : 'Pending'}
                      </span>
                      {!order.isDelivered && order.isPaid && (
                        <button
                          onClick={() => updateOrderDelivery(order._id)}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
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
              <p className="text-center text-gray-500 py-8">No orders found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;














