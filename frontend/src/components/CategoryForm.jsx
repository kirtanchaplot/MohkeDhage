const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full text-sm md:text-base"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 text-sm md:text-base w-full sm:w-auto">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm md:text-base w-full sm:w-auto"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;


// const CategoryForm = ({
//     value,
//     setValue,
//     handleSubmit,
//     buttonText = "Submit",
//     handleDelete,
//   }) => {
//     return (
//       <div className="p-3">
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             className="py-3 px-4 border rounded-lg w-full"
//             placeholder="Write category name"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//           />
  
//           <div className="flex justify-between">
//             <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 foucs:ring-pink-500 focus:ring-opacity-50">
//               {buttonText}
//             </button>
  
//             {handleDelete && (
//               <button
//                 onClick={handleDelete}
//                 className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 foucs:ring-red-500 focus:ring-opacity-50"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     );
//   };
  
//   export default CategoryForm;