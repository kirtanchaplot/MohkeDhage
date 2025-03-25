//all change

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text, color }) => {
  // Ensure value is a valid number between 0 and 5
  const safeValue = Math.max(0, Math.min(5, Number(value) || 0));
  const fullStars = Math.floor(safeValue);
  const halfStars = safeValue - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  // Adjust star size based on screen size
  const starClass = `text-${color} text-sm sm:text-base ml-0.5 sm:ml-1`;

  return (
    <div className="flex flex-wrap items-center">
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={starClass} />
        ))}

        {halfStars === 1 && <FaStarHalfAlt className={starClass} />}
        
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className={starClass} />
        ))}
      </div>

      {text && (
        <span className={`ml-2 text-xs sm:text-sm text-${color}`}>
          {text}
        </span>
      )}
    </div>
  );
};

Ratings.defaultProps = {
  color: "pink-500",
};

export default Ratings;