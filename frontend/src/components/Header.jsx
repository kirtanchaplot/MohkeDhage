import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  return (
    <div className="bg-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6 lg:py-6">
          {/* Main Carousel Section */}
          <div className="w-full lg:w-8/12">
            <div className="bg-gray-800/30 backdrop-blur rounded-xl overflow-hidden h-full">
              <ProductCarousel />
            </div>
          </div>

          {/* Top Products Section */}
          <div className="w-full lg:w-4/12 p-3 lg:p-0">
            <div className="bg-gray-800/50 backdrop-blur rounded-xl h-full flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Top Products
                </h2>
              </div>

              <div className="flex-1 p-3">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-8">
                    {error?.data?.message || error.error}
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                    <div className="space-y-3">
                      {data?.map((product) => (
                        <SmallProduct key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

