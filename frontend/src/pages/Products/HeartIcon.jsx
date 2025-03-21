// all change

import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product, size = "default" }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    // Prevent event bubbling to parent elements
    e.stopPropagation();
    e.preventDefault();
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  // Size variations
  const sizeClasses = {
    small: "text-base",
    default: "text-xl",
    large: "text-2xl"
  };

  // Container variations - different positions based on usage context
  const containerClasses = {
    small: "p-1",
    default: "p-1.5",
    large: "p-2"
  };

  return (
    <button
      className={`rounded-full bg-black bg-opacity-60 backdrop-blur-sm hover:bg-opacity-80 
                ${containerClasses[size]} transition-all duration-300 
                ${isAnimating ? "scale-125" : "scale-100"} z-10`}
      onClick={toggleFavorites}
      aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isFavorite ? (
        <FaHeart className={`${sizeClasses[size]} text-pink-500`} />
      ) : (
        <FaRegHeart className={`${sizeClasses[size]} text-white`} />
      )}
    </button>
  );
};

export default HeartIcon;