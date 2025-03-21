const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "succcess":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={`p-3 md:p-4 rounded text-sm md:text-base my-2 md:my-3 mx-2 md:mx-0 ${getVariantClass()}`}>
      {children}
    </div>
  );
};

export default Message;



