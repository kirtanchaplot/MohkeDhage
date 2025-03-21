import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Desktop Navigation
  const DesktopNav = () => (
    <div
      style={{ zIndex: 9999 }}
      className="hidden md:flex flex-col justify-between p-4 text-white bg-[#100f0f] w-[4%] hover:w-[15%] h-[100vh] fixed"
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>
          </div>

          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">
              Favorites
            </span>
            <FavoritesCount />
          </div>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                <span className="hidden nav-item-name">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd size={26} />
                <span className="hidden nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu} 
        className="fixed top-4 left-4 z-50 p-2 bg-[#100f0f] rounded-md text-white"
      >
        {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#100f0f] z-40 flex flex-col p-5 text-white">
          <div className="flex justify-end">
            <button onClick={toggleMobileMenu} className="p-2">
              <AiOutlineClose size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center mt-10 space-y-6">
            {userInfo && (
              <div className="mb-8 text-center">
                <span className="text-xl font-semibold">{userInfo.username}</span>
              </div>
            )}

            <Link to="/" className="flex items-center space-x-4" onClick={() => setMobileMenuOpen(false)}>
              <AiOutlineHome size={24} />
              <span>Home</span>
            </Link>

            <Link to="/shop" className="flex items-center space-x-4" onClick={() => setMobileMenuOpen(false)}>
              <AiOutlineShopping size={24} />
              <span>Shop</span>
            </Link>

            <Link to="/cart" className="flex items-center space-x-4" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative">
                <AiOutlineShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 px-1 py-0 text-xs text-white bg-pink-500 rounded-full">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            <Link to="/favorite" className="flex items-center space-x-4" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative">
                <FaHeart size={20} />
                <FavoritesCount />
              </div>
              <span>Favorites</span>
            </Link>

            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <div className="flex flex-col items-center space-y-4 mt-4 border-t border-gray-700 pt-4 w-full">
                    <span className="font-semibold text-pink-500">Admin Options</span>
                    <Link to="/admin/dashboard" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/admin/productlist" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                      Products
                    </Link>
                    <Link to="/admin/categorylist" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                      Categories
                    </Link>
                    <Link to="/admin/orderlist" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                      Orders
                    </Link>
                    <Link to="/admin/userlist" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                      Users
                    </Link>
                  </div>
                )}
                <div className="flex flex-col items-center space-y-4 mt-4 border-t border-gray-700 pt-4 w-full">
                  <Link to="/profile" className="w-full text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={logoutHandler} className="w-full text-center py-2 text-pink-500">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4 mt-4 border-t border-gray-700 pt-4 w-full">
                <Link to="/login" className="w-full text-center py-2 flex items-center justify-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <AiOutlineLogin size={20} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="w-full text-center py-2 flex items-center justify-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <AiOutlineUserAdd size={20} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

export default Navigation;
