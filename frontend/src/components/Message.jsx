const Message = ({ variant = 'info', children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "succcess":
        return "bg-green-100 text-green-800";
      case "error":
      case "danger":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
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

Message.defaultProps = {
  variant: 'info'
};

export default Message;



