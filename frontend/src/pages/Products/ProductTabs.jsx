//allchange

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text, color }) => {
  const safeValue = Math.max(0, Math.min(5, Number(value) || 0)); // Ensure value is between 0 and 5
  const fullStars = Math.floor(safeValue);
  const halfStars = safeValue - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = Math.max(0, 5 - fullStars - halfStars); // Ensure it's not negative

  return (
    <div className="flex items-center flex-wrap">
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className={`text-${color} text-lg`} />
        ))}

        {halfStars === 1 && <FaStarHalfAlt className={`text-${color} text-lg`} />}
        
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className={`text-${color} text-lg`} />
        ))}
      </div>

      {text && <span className={`ml-2 text-${color}`}>{text}</span>}
    </div>
  );
};

Ratings.defaultProps = {
  color: "pink-500",
};

export default Ratings;