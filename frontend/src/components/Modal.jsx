const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-[90%] md:max-w-md w-full mx-auto overflow-hidden transform transition-all">
            <div className="absolute top-2 right-2">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;



