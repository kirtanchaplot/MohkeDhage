//all change
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import Footer from "../components/Footer";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section with Header */}
        <div className="relative">
          <Header />
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Featured Section Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured Collection
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : error ? (
            <div className="max-w-3xl mx-auto py-8">
              <Message variant="danger">
                {error?.data?.message || error?.error || "An error occurred"}
              </Message>
            </div>
          ) : (
            <>
              {data?.products?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white mb-3">
                      No Products Found
                    </h2>
                    <p className="text-gray-400">
                      We couldn't find any products matching your criteria.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {data?.products?.map((product) => (
                    <div 
                      key={product._id} 
                      className="transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;