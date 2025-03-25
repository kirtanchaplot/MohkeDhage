// all change

import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
// import getImageUrl from "../../../Utils/imageUrl";
import getImageUrl from "../../Utils/imageUrl";


const Product = ({ product }) => {
  // Set default rating to 4 if not provided
  const rating = product.rating || 4;
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
        <img
          // src={product.image}
          src={getImageUrl(product.image)}//new111
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <HeartIcon product={product} />
        
        {/* Product Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-lg font-bold">
                ₹{product.price}
              </span>
              <div className="flex items-center bg-pink-500/90 px-2 py-0.5 rounded-full">
                <span className="text-white text-sm">
                  {rating}★
                </span>
              </div>
            </div>
            
            <Link to={`/product/${product._id}`}>
              <h2 className="text-white text-sm sm:text-base font-medium line-clamp-2">
                {product.name}
              </h2>
              <div className="flex items-center justify-between mt-1">
                <div className="text-gray-200 text-xs">
                  Brand: {product.brand || 'MKD'}
                </div>
                <div className="text-gray-200 text-xs">
                  Stock: {product.countInStock}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;