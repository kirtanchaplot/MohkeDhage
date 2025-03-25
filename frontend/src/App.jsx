import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'; 

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3 md:ml-[4%] transition-[margin] duration-300 ease-in-out" id="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default App;