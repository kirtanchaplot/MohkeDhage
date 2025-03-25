import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import getImageUrl from "../../Utils/imageUrl";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading products
      </div>
    );
  }

  if (!products) {
    return (
      <div className="text-center text-gray-500 p-4">
        No products found
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <AdminMenu />
      
      <div className="w-full px-4 py-4 md:p-6">
        <div className="border-b pb-3 mb-4">
          <h1 className="text-xl font-bold">
            All Products ({products?.length || 0})
          </h1>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div 
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-black-100"
            >
              <Link to={`/admin/product/update/${product._id}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-[120px] md:w-[150px] h-[150px] sm:h-auto overflow-hidden">
                    <img
                      // src={product.image?.startsWith('/') ? product.image : `/${product.image}`}
                      src={getImageUrl(product.image)}//new11
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-3 sm:p-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h2 className="text-lg font-semibold">{product?.name}</h2>
                      <p className="text-gray-500 text-xs mt-1 sm:mt-0">
                        {moment(product.createdAt).format("MMM D, YYYY")}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product?.description?.substring(0, 120)}...
                    </p>
                    
                    <div className="flex flex-wrap justify-between items-center mt-auto">
                      <div className="text-pink-600 font-bold">
                        ₹ {product?.price}
                      </div>
                      
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 transition-colors"
                      >
                        Update
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;








