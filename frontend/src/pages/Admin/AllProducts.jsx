import { Link } from "react-router-dom";
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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/admin/product/update/${product._id}`}>
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  
                  {/* Product Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-lg font-bold">
                          ₹{product.price}
                        </span>
                        <div className="flex items-center bg-pink-500/90 px-2 py-0.5 rounded-full">
                          <span className="text-white text-sm">
                            {product.rating || 4}★
                          </span>
                        </div>
                      </div>
                      
                      <h2 className="text-white text-sm sm:text-base font-medium line-clamp-2">
                        {product.name}
                      </h2>
                      
                      <div className="mt-2">
                        <button
                          className="w-full py-1.5 text-sm font-medium text-center text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-colors"
                        >
                          Update Product
                        </button>
                      </div>
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








