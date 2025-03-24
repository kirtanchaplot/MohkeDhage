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
    <div className="mb-4 w-full px-4 sm:px-0">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="px-1 sm:px-2">
                <div className="relative">
                  <img
                    // src={image}
                    src={getImageUrl(image)}//new11
                    alt={name}
                    className="w-full rounded-lg object-cover h-48 sm:h-64 md:h-80 lg:h-96"
                  />
                </div>

                <div className="mt-4 flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-bold text-lg sm:text-xl md:text-2xl">{name}</h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 text-pink-500"> ₹ {price}</p>
                    <p className="mt-2 sm:mt-4 text-sm sm:text-base text-[#B0B0B0] line-clamp-3 md:line-clamp-4">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
                    <h1 className="flex items-center">
                      <FaStore className="mr-2 text-white flex-shrink-0" /> 
                      <span className="truncate">Brand: {brand}</span>
                    </h1>
                    <h1 className="flex items-center">
                      <FaStar className="mr-2 text-white flex-shrink-0" /> 
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
                      <FaStar className="mr-2 text-white flex-shrink-0" /> 
                      <span className="truncate">Review: {numReviews}</span>
                    </h1>
                    <h1 className="flex items-center">
                      <FaBox className="mr-2 text-white flex-shrink-0" /> 
                      <span className="truncate">In Stock: {countInStock}</span>
                    </h1>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;