//all change

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Rating from "./Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-4">
        <Link
          className="inline-flex items-center text-white font-semibold hover:underline"
          to="/"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </Link>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 my-8">
            <div className="relative w-full md:w-1/2 lg:w-3/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">{product.name}</h2>
                <div className="my-3">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>
                <p className="my-4 text-[#B0B0B0]">
                  {product.description}
                </p>
                <p className="text-3xl md:text-4xl lg:text-5xl my-4 font-extrabold">${product.price}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div>
                  <h1 className="flex items-center mb-4">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    <span className="ml-1 font-medium">{product.brand}</span>
                  </h1>
                  <h1 className="flex items-center mb-4">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    <span className="ml-1 font-medium">{moment(product.createdAt).fromNow()}</span>
                  </h1>
                  <h1 className="flex items-center mb-4">
                    <FaStar className="mr-2 text-white" /> Reviews:{" "}
                    <span className="ml-1 font-medium">{product.numReviews}</span>
                  </h1>
                </div>

                <div>
                  <h1 className="flex items-center mb-4">
                    <FaStar className="mr-2 text-white" /> Ratings:{" "}
                    <span className="ml-1 font-medium">{rating}</span>
                  </h1>
                  <h1 className="flex items-center mb-4">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    <span className="ml-1 font-medium">{product.quantity}</span>
                  </h1>
                  <h1 className="flex items-center mb-4">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "}
                    <span className="ml-1 font-medium">{product.countInStock}</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-3 w-full sm:w-24 rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-3 px-6 rounded-lg w-full sm:w-auto font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>
            </div>
          </div>

          <div className="my-12">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Product;