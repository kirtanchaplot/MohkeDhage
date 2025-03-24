// all chnage
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
// import { getImageUrl } from "../Utils/getImageUrl";
import getImageUrl from "../Utils/imageUrl"; 


const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <FaShoppingCart className="mx-auto text-6xl mb-4 text-gray-400" />
          <p className="text-xl mb-6">Your cart is empty</p>
          <Link 
            to="/shop" 
            className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-600 rounded overflow-hidden">
                    <img
                      // src={item.image}
                      src={getImageUrl(item.image)}

                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link to={`/product/${item._id}`} className="text-lg font-medium text-pink-400 hover:text-pink-300">
                      {item.name}
                    </Link>

                    <div className="text-sm text-gray-300 mt-1">{item.brand}</div>
                    <div className="text-lg font-bold mt-1">₹ {item.price}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      className="p-2 w-16 border border-gray-600 rounded bg-gray-700 text-white"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      className="text-red-400 hover:text-red-300 p-2"
                      onClick={() => removeFromCartHandler(item._id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-700">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-2xl font-bold flex justify-between py-4 border-t border-gray-700">
                <span>Total:</span>
                <span>₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>

              <button
                className="bg-pink-500 hover:bg-pink-600 transition-colors mt-6 py-3 px-4 rounded-lg text-lg w-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;