//all change


import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;
  const [prevCount, setPrevCount] = useState(favoriteCount);

  // Track count changes for animation
  useEffect(() => {
    setPrevCount(favoriteCount);
  }, [favoriteCount]);

  // Determine if count increased or decreased
  const hasIncreased = favoriteCount > prevCount;

  return (
    <div className="relative inline-flex">
      {favoriteCount > 0 && (
        <span 
          className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-bold text-white bg-pink-600 rounded-full px-1 
            ${hasIncreased ? "animate-pulse" : ""}`}
          style={{ fontSize: "10px" }}
        >
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;