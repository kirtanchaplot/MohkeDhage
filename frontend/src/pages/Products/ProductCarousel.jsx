//all change

import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
// import getImageUrl from "../../../Utils/imageUrl";
import getImageUrl from "../../Utils/imageUrl";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <Message variant="error">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="h-full">
          <Slider {...settings}>
            {products.map(({
              _id,
              name,
              image,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              countInStock,
              quantity,
              price
            }) => (
              <div key={_id} className="relative h-[500px]">
                <img
                  src={getImageUrl(image)}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-200 mb-2 line-clamp-2">
                      {description}
                    </p>
                    <div className="text-xl sm:text-2xl font-bold text-pink-500 mb-2">
                      ₹{price}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
                      <h1 className="flex items-center">
                        <FaStore className="mr-2 text-white flex-shrink-0" /> 
                        <span className="truncate">Brand: {brand}</span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaStar className="mr-2 text-pink-500 flex-shrink-0" /> 
                        <span className="truncate">Ratings: {Math.round(rating)}</span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaClock className="mr-2 text-white flex-shrink-0" /> 
                        <span className="truncate">Added: {moment(createdAt).fromNow()}</span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaShoppingCart className="mr-2 text-white flex-shrink-0" /> 
                        <span className="truncate">Quantity: {quantity}</span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaStar className="mr-2 text-pink-500 flex-shrink-0" /> 
                        <span className="truncate">Review: {numReviews}</span>
                      </h1>
                      <h1 className="flex items-center">
                        <FaBox className="mr-2 text-white flex-shrink-0" /> 
                        <span className="truncate">In Stock: {countInStock}</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;