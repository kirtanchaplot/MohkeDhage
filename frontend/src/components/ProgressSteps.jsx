const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center px-2 py-4 overflow-x-auto w-full">
      <div className="flex space-x-1 md:space-x-4 items-center min-w-min">
        <div className={`flex flex-col items-center ${step1 ? "text-green-500" : "text-gray-300"}`}>
          <span className="text-xs md:text-sm font-medium">Login</span>
          <div className="mt-1 md:mt-2 text-base md:text-lg text-center">✅</div>
        </div>

        {step2 && (
          <>
            {step1 && <div className="h-0.5 w-5 md:w-16 bg-green-500"></div>}
            <div className={`flex flex-col items-center ${step1 ? "text-green-500" : "text-gray-300"}`}>
              <span className="text-xs md:text-sm font-medium">Shipping</span>
              <div className="mt-1 md:mt-2 text-base md:text-lg text-center">✅</div>
            </div>
          </>
        )}

        <>
          {step1 && step2 && step3 ? (
            <div className="h-0.5 w-5 md:w-16 bg-green-500"></div>
          ) : (
            ""
          )}

          <div className={`flex flex-col items-center ${step3 ? "text-green-500" : "text-gray-300"}`}>
            <span className="text-xs md:text-sm font-medium">Summary</span>
            {step1 && step2 && step3 ? (
              <div className="mt-1 md:mt-2 text-base md:text-lg text-center">✅</div>
            ) : (
              ""
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default ProgressSteps;



















// const ProgressSteps = ({ step1, step2, step3 }) => {
//     return (
//       <div className="flex justify-center items-center space-x-4">
//         <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
//           <span className="ml-2">Login</span>
//           <div className="mt-2 text-lg text-center">✅</div>
//         </div>
  
//         {step2 && (
//           <>
//             {step1 && <div className="h-0.5 w-[10rem] bg-green-500"></div>}
//             <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
//               <span>Shipping</span>
//               <div className="mt-2 text-lg text-center">✅</div>
//             </div>
//           </>
//         )}
  
//         <>
//           {step1 && step2 && step3 ? (
//             <div className="h-0.5 w-[10rem] bg-green-500"></div>
//           ) : (
//             ""
//           )}
  
//           <div className={`${step3 ? "text-green-500" : "text-gray-300"}`}>
//             <span className={`${!step3 ? "ml-[10rem]" : ""}`}>Summary</span>
//             {step1 && step2 && step3 ? (
//               <div className="mt-2 text-lg text-center">✅</div>
//             ) : (
//               ""
//             )}
//           </div>
//         </>
//       </div>
//     );
//   };
  
//   export default ProgressSteps;