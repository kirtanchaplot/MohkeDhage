import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  
  // Replace text input with a range slider value
  const [priceRange, setPriceRange] = useState(10000);
  const minPrice = 0;
  const maxPrice = 5000;

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price range
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price is less than or equal to the selected price range
            return product.price <= priceRange;
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceRange]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand && product.price <= priceRange
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price range when slider is moved
    setPriceRange(Number(e.target.value));
  };
  // CSS classes for product hover animation
  const productCardStyle = {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  // Calculate what percentage of the slider is filled
  const sliderProgress = ((priceRange - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Custom styles for slider
  const sliderStyle = {
    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${sliderProgress}%, #e5e7eb ${sliderProgress}%, #e5e7eb 100%)`,
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex ietms-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-enter mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem]">
              {/* Replace text input with a slider */}
              <div className="price-slider-container">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={sliderStyle}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white text-sm">₹{minPrice}</span>
                  <span className="text-white text-sm font-medium">₹{priceRange}</span>
                  <span className="text-white text-sm">₹{maxPrice}</span>
                </div>
              </div>
              
              {/* Add animation for the price updates */}
              <div className="mt-4 text-center">
                <div className="text-white font-medium bg-pink-500 bg-opacity-20 py-1 px-2 rounded-md transition-all duration-300">
                  Showing products from ₹{minPrice} to ₹{priceRange}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div 
                    className="p-3 product-card-container" 
                    key={p._id}
                    style={{
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="product-card-wrapper transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-10 rounded-lg overflow-hidden"
                      style={productCardStyle}
                    >
                      <ProductCard p={p} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;