import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-around items-center lg:items-start">
      {/* Grid for large screens, single column for small screens */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {data.map((product) => (
          <div key={product._id}>
            <SmallProduct product={product} />
          </div>
        ))}
      </div>
      {/* Product Carousel always visible */}
      <div className="w-full lg:w-auto mt-4 lg:mt-0">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;






// import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
// import Loader from "./Loader";
// import SmallProduct from "../pages/Products/SmallProduct";
// import ProductCarousel from "../pages/Products/ProductCarousel";

// const Header = () => {
//   const { data, isLoading, error } = useGetTopProductsQuery();

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <h1>ERROR</h1>;
//   }

//   return (
//     <>
//       <div className="flex justify-around">
//         <div className="xl:block lg:hidden md:hidden:sm:hidden">
//           <div className="grid grid-cols-2">
//             {data.map((product) => (
//               <div key={product._id}>
//                 <SmallProduct product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//         <ProductCarousel />
//       </div>
//     </>
//   );
// };

// export default Header;