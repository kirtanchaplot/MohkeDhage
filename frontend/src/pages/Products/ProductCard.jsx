//all chnage

import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

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
    <div className="w-full h-full bg-[#1A1A1A] rounded-lg shadow overflow-hidden flex flex-col">
      <section className="relative">
        <Link to={`/product/${p?._id}`} className="block">
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 z-10">
            {p?.brand || "Unknown Brand"}
          </span>
          <div className="overflow-hidden">
            <img
              className="w-full h-40 sm:h-48 md:h-52 object-cover transition-transform duration-300 hover:scale-105"
              src={p?.image || "/placeholder-image.jpg"} 
              alt={p?.name || "Product Image"}
            />
          </div>
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-3 sm:p-4 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
          <h5 className="text-base sm:text-lg font-medium text-white line-clamp-1 mb-1 sm:mb-0">
            {p?.name || "Unnamed Product"}
          </h5>

          <p className="font-semibold text-pink-500 whitespace-nowrap">
            {p?.price
              ? p.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })
              : "Rs0.00"}
          </p>
        </div>

        <p className="mb-3 text-sm font-normal text-[#CFCFCF] line-clamp-2">
          {p?.description?.substring(0, 60) || "No description available"} ...
        </p>

        <section className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p?._id}`}
            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
            <svg
              className="w-3 h-3 ml-1 sm:ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full hover:bg-pink-800/20 transition-colors"
            onClick={() => addToCartHandler(p, 1)}
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart size={20} className="text-white" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;