//all change

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders?.length === 0 ? (
        <div className="text-center py-4">
          <p className="mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Image</th>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Paid</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Delivered</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="bg-gray-900 bg-opacity-50 hover:bg-gray-800 transition-colors">
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4 truncate max-w-[120px]">
                    <span className="font-mono text-sm">{order._id}</span>
                  </td>
                  <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-3 px-4 font-semibold">₹ {order.totalPrice}</td>
                  <td className="py-3 px-4">
                    {order.isPaid ? (
                      <span className="inline-block py-1 px-2 text-center bg-green-500 text-white text-xs font-medium rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-block py-1 px-2 text-center bg-red-500 text-white text-xs font-medium rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {order.isDelivered ? (
                      <span className="inline-block py-1 px-2 text-center bg-green-500 text-white text-xs font-medium rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-block py-1 px-2 text-center bg-red-500 text-white text-xs font-medium rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-500 text-white py-1 px-3 rounded hover:bg-pink-600 transition-colors text-sm font-medium">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;