//all chnage

import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import getImageUrl from "../../Utils/imageUrl";     //new11111111

const SmallProduct = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/50 transition-colors">
        {/* Image Container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-1 right-1 scale-75">
            <HeartIcon product={product} />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white text-sm font-medium line-clamp-2">
              {product.name}
            </h3>
            <span className="flex-shrink-0 bg-pink-500/90 text-white text-xs px-2 py-1 rounded-full">
              ₹{product.price}
            </span>
          </div>
          
          <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
            <span>{product.brand || 'MKD'}</span>
            <div className="flex items-center">
              <span className="text-pink-500">★</span>
              <span className="ml-1">{product.rating || 4}</span>
            </div>
          </div>

          <div className="mt-1 text-xs text-gray-400">
            Stock: {product.countInStock} units
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SmallProduct;