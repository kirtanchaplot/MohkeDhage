//all change
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="py-8">
            <Message variant="danger">
              {error?.data?.message || error?.error || "Something went wrong."}
            </Message>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center py-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-0">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-pink-600 hover:bg-pink-700 transition-colors font-bold rounded-full py-2 px-6 md:px-10"
              >
                Shop
              </Link>
            </div>

            {data?.products?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">No products found</p>
                {keyword && (
                  <Link to="/" className="text-pink-500 block mt-4">
                    Go back to home
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {data?.products?.map((product) => (
                  <div key={product._id} className="product-card-animation hover:transform hover:scale-105 transition-all duration-300">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;