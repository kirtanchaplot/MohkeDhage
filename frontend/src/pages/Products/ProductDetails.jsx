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
  FaArrowLeft,
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

  // Reset form & log product image when product changes
  useEffect(() => {
    setRating(0);
    setComment("");

    if (product) {
      console.log("Product Image URL:", product.image);
    }
  }, [productId, product]);

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();

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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <Link
        to="/"
        className="flex items-center text-white font-semibold hover:underline mb-4"
      >
        <FaArrowLeft className="mr-2" /> Go Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image with Heart Icon */}
        <div className="lg:w-1/2 relative">
          {product.image && (
            <>
              {console.log("Rendering Image:", product.image)}
              <img
                      src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                      alt={product.name}
                      className="w-full rounded-lg object-contain h-64 sm:h-80 md:h-96 lg:h-[32rem]"
                      onError={(e) => {
                        console.error(`Failed to load image: ${product.image}`);
                        e.target.src = '/placeholder.png'; // Add a placeholder image
                      }}
                    />
            </>
          )}
          <HeartIcon product={product} />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col">
          <h2 className="text-xl sm:text-2xl font-semibold">{product.name}</h2>
          
          <div className="my-3">
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
          
          <p className="mt-2 mb-4 text-sm sm:text-base text-[#B0B0B0]">
            {product.description}
          </p>

          <p className="text-3xl sm:text-4xl lg:text-5xl my-4 font-extrabold text-pink-600">₹ {product.price}</p>

          {/* Product Metadata */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-4 text-sm">
            <div className="flex items-center">
              <FaStore className="mr-2 text-white" /> 
              <span>Brand: {product.brand}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="mr-2 text-white" /> 
              <span>Ratings: {product.rating}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-white" /> 
              <span>Added: {moment(product.createdAt).fromNow()}</span>
            </div>
            <div className="flex items-center">
              <FaShoppingCart className="mr-2 text-white" /> 
              <span>Quantity: {product.quantity}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="mr-2 text-white" /> 
              <span>Reviews: {product.numReviews}</span>
            </div>
            <div className="flex items-center">
              <FaBox className="mr-2 text-white" /> 
              <span>In Stock: {product.countInStock}</span>
            </div>
          </div>

          {/* Quantity Selection & Add to Cart */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            {product.countInStock > 0 && (
              <div className="w-full sm:w-auto">
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 w-full sm:w-24 rounded-lg text-pink-600 bg-white focus:outline-none"
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

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full sm:w-auto bg-pink-600 text-white py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors"
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs (Reviews, etc.) */}
      <div className="mt-12">
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
  );
};

export default ProductDetails;








// //all change

// import { useState, useEffect, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   useGetProductDetailsQuery,
//   useCreateReviewMutation,
// } from "../../redux/api/productApiSlice";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";
// import {
//   FaBox,
//   FaClock,
//   FaShoppingCart,
//   FaStar,
//   FaStore,
//   FaArrowLeft,
// } from "react-icons/fa";
// import moment from "moment";
// import HeartIcon from "./HeartIcon";
// import Ratings from "./Ratings";
// import ProductTabs from "./ProductTabs";
// import { addToCart } from "../../redux/features/cart/cartSlice";

// const ProductDetails = () => {
//   const { id: productId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [qty, setQty] = useState(1);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   const {
//     data: product,
//     isLoading,
//     refetch,
//     error,
//   } = useGetProductDetailsQuery(productId);

//   const { userInfo } = useSelector((state) => state.auth);

//   const [createReview, { isLoading: loadingProductReview }] =
//     useCreateReviewMutation();

//   // Reset form after component mounts or product changes
//   useEffect(() => {
//     setRating(0);
//     setComment("");
//   }, [productId]);

//   const submitHandler = useCallback(async (e) => {
//     e.preventDefault();

//     // Form validation
//     if (rating === 0) {
//       toast.error("Please select a rating");
//       return;
//     }

//     try {
//       await createReview({
//         productId,
//         rating,
//         comment,
//       }).unwrap();
      
//       refetch();
//       toast.success("Review created successfully");
//       setRating(0);
//       setComment("");
//     } catch (error) {
//       toast.error(error?.data?.message || error.message);
//     }
//   }, [productId, rating, comment, createReview, refetch]);

//   const addToCartHandler = useCallback(() => {
//     if (product && product.countInStock > 0) {
//       dispatch(addToCart({ ...product, qty: Number(qty) }));
//       navigate("/cart");
//     }
//   }, [dispatch, navigate, product, qty]);

//   if (isLoading) return <Loader />;
  
//   if (error) {
//     return (
//       <Message variant="danger">
//         {error?.data?.message || error.message}
//       </Message>
//     );
//   }

//   if (!product) {
//     return <Message>Product not found</Message>;
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
//       <Link
//         to="/"
//         className="flex items-center text-white font-semibold hover:underline mb-4"
//       >
//         <FaArrowLeft className="mr-2" /> Go Back
//       </Link>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Product Image with Heart Icon */}
//         <div className="lg:w-1/2 relative">
//           {product.image && (
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full rounded-lg object-contain h-64 sm:h-80 md:h-96 lg:h-[32rem]"
//             />
//           )}
//           <HeartIcon product={product} />
//         </div>

//         {/* Product Details */}
//         <div className="lg:w-1/2 flex flex-col">
//           <h2 className="text-xl sm:text-2xl font-semibold">{product.name}</h2>
          
//           <div className="my-3">
//             <Ratings
//               value={product.rating}
//               text={`${product.numReviews} reviews`}
//             />
//           </div>
          
//           <p className="mt-2 mb-4 text-sm sm:text-base text-[#B0B0B0]">
//             {product.description}
//           </p>

//           <p className="text-3xl sm:text-4xl lg:text-5xl my-4 font-extrabold text-pink-600">₹ {product.price}</p>

//           {/* Product Metadata */}
//           <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-4 text-sm">
//             <div className="flex items-center">
//               <FaStore className="mr-2 text-white" /> 
//               <span>Brand: {product.brand}</span>
//             </div>
//             <div className="flex items-center">
//               <FaStar className="mr-2 text-white" /> 
//               <span>Ratings: {product.rating}</span>
//             </div>
//             <div className="flex items-center">
//               <FaClock className="mr-2 text-white" /> 
//               <span>Added: {moment(product.createdAt).fromNow()}</span>
//             </div>
//             <div className="flex items-center">
//               <FaShoppingCart className="mr-2 text-white" /> 
//               <span>Quantity: {product.quantity}</span>
//             </div>
//             <div className="flex items-center">
//               <FaStar className="mr-2 text-white" /> 
//               <span>Reviews: {product.numReviews}</span>
//             </div>
//             <div className="flex items-center">
//               <FaBox className="mr-2 text-white" /> 
//               <span>In Stock: {product.countInStock}</span>
//             </div>
//           </div>

//           {/* Quantity Selection & Add to Cart */}
//           <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
//             {product.countInStock > 0 && (
//               <div className="w-full sm:w-auto">
//                 <select
//                   value={qty}
//                   onChange={(e) => setQty(Number(e.target.value))}
//                   className="p-2 w-full sm:w-24 rounded-lg text-pink-600 bg-white focus:outline-none"
//                   aria-label="Product quantity"
//                 >
//                   {[...Array(product.countInStock).keys()].map((x) => (
//                     <option key={x + 1} value={x + 1}>
//                       {x + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             <button
//               onClick={addToCartHandler}
//               disabled={product.countInStock === 0}
//               className="w-full sm:w-auto bg-pink-600 text-white py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-pink-700 transition-colors"
//             >
//               {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Product Tabs (Reviews, etc.) */}
//       <div className="mt-12">
//         <ProductTabs
//           loadingProductReview={loadingProductReview}
//           userInfo={userInfo}
//           submitHandler={submitHandler}
//           rating={rating}
//           setRating={setRating}
//           comment={comment}
//           setComment={setComment}
//           product={product}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;