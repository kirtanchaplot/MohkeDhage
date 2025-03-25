//all chnage

import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import getImageUrl from "../../Utils/imageUrl";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative group">
        <Link to={`/product/${p?._id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              src={getImageUrl(p?.image)}
              alt={p?.name || "Product Image"}
            />
          </div>
        </Link>
        
        <div className="absolute top-2 right-2">
          <HeartIcon product={p} />
        </div>
        
        <div className="absolute bottom-2 right-2">
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
            {p?.brand || "MKD"}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/product/${p?._id}`} className="block flex-grow">
          <h3 className="text-white font-medium text-sm sm:text-base mb-1 line-clamp-1">
            {p?.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
            {p?.description?.substring(0, 60) || "No description available"} ...
          </p>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-pink-500 font-semibold text-sm sm:text-base">
            ₹{p?.price?.toLocaleString() || "0"}
          </span>
          
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${p?._id}`}
              className="inline-flex items-center text-xs px-3 py-1.5 text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-colors"
            >
              Read More
            </Link>
            
            <button
              onClick={() => addToCartHandler(p, 1)}
              className="p-1.5 rounded-full hover:bg-pink-600/20 transition-colors"
              aria-label="Add to cart"
            >
              <AiOutlineShoppingCart className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;