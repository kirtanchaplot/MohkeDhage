// all change

import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with back button - Mobile Friendly */}
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          My Wishlist
        </h1>
        <span className="ml-2 bg-pink-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {favorites.length}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-gray-800 rounded-full p-6 mb-4">
            <FaArrowLeft className="text-pink-500 text-3xl animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Items added to your wishlist will be saved here. Start shopping to add your favorite items.
          </p>
          <Link
            to="/"
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;