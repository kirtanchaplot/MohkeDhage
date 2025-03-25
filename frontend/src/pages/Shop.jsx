//all change
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

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
  
  // Mobile filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  // Collapsible sections for mobile
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Replace text input with a range slider value
  const [priceRange, setPriceRange] = useState(5000);
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
    
    // Close mobile filters after selection on small screens
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
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

  // Calculate what percentage of the slider is filled
  const sliderProgress = ((priceRange - minPrice) / (maxPrice - minPrice)) * 100;
  
  // Custom styles for slider
  const sliderStyle = {
    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${sliderProgress}%, #e5e7eb ${sliderProgress}%, #e5e7eb 100%)`,
  };
  
  const resetFilters = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="flex items-center bg-pink-600 text-white py-2 px-4 rounded"
        >
          {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <h2 className="text-lg font-medium">{products?.length} Products</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar - with mobile responsiveness */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* Categories Section */}
            <div className="border-b border-gray-700">
              <button 
                className="w-full px-4 py-3 bg-gray-900 flex justify-between items-center"
                onClick={() => toggleSection('categories')}
              >
                <h2 className="font-semibold">Categories</h2>
                {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.categories && (
                <div className="p-4">
                  {categories?.map((c) => (
                    <div key={c._id} className="mb-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${c._id}`}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                      />
                      <label
                        htmlFor={`category-${c._id}`}
                        className="ml-2 text-sm"
                      >
                        {c.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Brands Section */}
            <div className="border-b border-gray-700">
              <button 
                className="w-full px-4 py-3 bg-gray-900 flex justify-between items-center"
                onClick={() => toggleSection('brands')}
              >
                <h2 className="font-semibold">Brands</h2>
                {expandedSections.brands ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.brands && (
                <div className="p-4">
                  {uniqueBrands?.map((brand) => (
                    <div key={brand} className="mb-2 flex items-center">
                      <input
                        type="radio"
                        id={`brand-${brand}`}
                        name="brand"
                        onChange={() => handleBrandClick(brand)}
                        className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Range Section */}
            <div className="border-b border-gray-700">
              <button 
                className="w-full px-4 py-3 bg-gray-900 flex justify-between items-center"
                onClick={() => toggleSection('price')}
              >
                <h2 className="font-semibold">Price Range</h2>
                {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.price && (
                <div className="p-4">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={sliderStyle}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>₹{minPrice}</span>
                    <span className="font-medium text-pink-400">₹{priceRange}</span>
                    <span>₹{maxPrice}</span>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="text-sm bg-pink-500 bg-opacity-20 py-1 px-2 rounded">
                      ₹{minPrice} - ₹{priceRange}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Reset Button */}
            <div className="p-4">
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {products?.length || 0} Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((p) => (
              <div key={p._id} className="product-card-animation">
                <ProductCard p={p} />
              </div>
            ))}
          </div>

          {!products?.length && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No products found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;