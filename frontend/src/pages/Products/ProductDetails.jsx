import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Reset form after component mounts or product changes
  useEffect(() => {
    setRating(0);
    setComment("");
  }, [productId]);

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();

    // Form validation
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }, [productId, rating, comment, createReview, refetch]);

  const addToCartHandler = useCallback(() => {
    if (product && product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: Number(qty) }));
      navigate("/cart");
    }
  }, [dispatch, navigate, product, qty]);

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );
  }

  if (!product) {
    return <Message>Product not found</Message>;
  }

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
        <div>
          
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
            />
          )}

          <HeartIcon product={product} />
        </div>

        <div className="flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
            {product.description}
          </p>

          <p className="text-5xl my-4 font-extrabold">₹ {product.price}</p>

          <div className="flex items-center justify-between w-[20rem]">
            <div className="one">
              <h1 className="flex items-center mb-6">
                <FaStore className="mr-2 text-white" /> Brand:{" "}
                {product.brand}
              </h1>
              <h1 className="flex items-center mb-6 w-[20rem]">
                <FaClock className="mr-2 text-white" /> Added:{" "}
                {moment(product.createdAt).fromNow()}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Reviews:{" "}
                {product.numReviews}
              </h1>
            </div>

            <div className="two">
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Ratings: {product.rating}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                {product.quantity}
              </h1>
              <h1 className="flex items-center mb-6 w-[10rem]">
                <FaBox className="mr-2 text-white" /> In Stock:{" "}
                {product.countInStock}
              </h1>
            </div>
          </div>

          <div className="flex justify-between flex-wrap">
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />

            {product.countInStock > 0 && (
              <div className="border-1 border-white rounded-lg bg-white p-1">
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-05 w-[4rem] rounded-lg text-pink-400 bg-white focus:outline-none"
                  aria-label="Product quantity"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="btn-container">
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
            </button>
          </div>
        </div>

        <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
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
      </div>
    </>
  );
};

export default ProductDetails;