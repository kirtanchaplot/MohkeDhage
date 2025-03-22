// all change

import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 p-3 mx-auto sm:mx-2">
      <div className="relative overflow-hidden rounded group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-64 rounded object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-base md:text-lg font-medium line-clamp-1">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 whitespace-nowrap">
              ₹{product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;