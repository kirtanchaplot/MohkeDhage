import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center my-8"><Loader /></div>;
  }

  if (error) {
    return <h1 className="text-center text-red-500 my-4">ERROR</h1>;
  }

  return (
    <div className="px-2 md:px-4 max-w-screen-xl mx-auto">
      {/* Product Carousel always visible and prioritized on mobile */}
      <div className="w-full mb-6">
        <ProductCarousel />
      </div>
      
      {/* Small products grid - Responsive with different layouts */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {data?.map((product) => (
          <div key={product._id} className="w-full">
            <SmallProduct product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;

