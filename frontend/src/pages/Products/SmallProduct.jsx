//all chnage

import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-40 md:w-48 lg:w-52 p-2">
      <div className="relative overflow-hidden rounded group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 sm:h-36 object-cover rounded transition-transform duration-300 group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-2">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <div className="text-sm font-medium line-clamp-1">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 whitespace-nowrap">
              ₹{product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;