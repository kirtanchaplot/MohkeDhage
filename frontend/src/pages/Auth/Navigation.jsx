import { useState, useEffect, useRef } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Add event listeners for sidebar hover
  const handleSidebarHover = (isHovering) => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.marginLeft = isHovering ? '15%' : '4%';
    }
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when navigating to a different page
  useEffect(() => {
    return () => setDropdownOpen(false);
  }, []);

  // Desktop Navigation
  const DesktopNav = () => (
    <div
      style={{ zIndex: 50 }}
      className="hidden md:flex flex-col justify-between p-4 text-white bg-[#100f0f] w-[4%] hover:w-[15%] h-[100vh] fixed"
      id="navigation-container"
      onMouseEnter={() => handleSidebarHover(true)}
      onMouseLeave={() => handleSidebarHover(false)}
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

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center text-white focus:outline-none px-2 py-1 rounded hover:bg-gray-800 transition-colors"
        >
          {userInfo ? (
            <span className="text-white flex items-center">
              <span className="mr-1">{userInfo.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
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
            </span>
          ) : (
            <></>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute dropdown-menu show mt-2 space-y-2 bg-white text-gray-600 rounded shadow-lg ${
              !userInfo.isAdmin ? "top-full" : "bottom-full"
            } right-0 z-[60] w-40 md:w-48 overflow-hidden`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link 
                to="/profile" 
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logoutHandler();
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 whitespace-nowrap"
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
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#100f0f] rounded-md text-white"
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-75 z-50 transition-opacity ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-y-0 left-0 w-9/12 max-w-sm bg-black transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-xl font-semibold text-white">{userInfo ? userInfo.username : "Leader"}</span>
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Navigation Links */}
              <div className="px-4 space-y-3">
                <Link to="/" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  <AiOutlineHome size={24} className="mr-3" />
                  <span>Home</span>
                </Link>

                <Link to="/shop" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  <AiOutlineShopping size={24} className="mr-3" />
                  <span>Shop</span>
                </Link>

                <Link to="/cart" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <AiOutlineShoppingCart size={24} className="mr-3" />
                    <span>Cart</span>
                    {cartItems.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-sm bg-pink-500 rounded-full">
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    )}
                  </div>
                </Link>

                <Link to="/favorite" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <FaHeart size={20} className="mr-3" />
                    <span>Favorites</span>
                    <FavoritesCount />
                  </div>
                </Link>

                {/* Admin Options */}
                {userInfo && userInfo.isAdmin && (
                  <div className="py-3">
                    <h3 className="text-pink-500 font-semibold mb-2">Admin Options</h3>
                    <div className="space-y-2">
                      <Link to="/admin/dashboard" className="block text-white py-1.5" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                      <Link to="/admin/productlist" className="block text-white py-1.5" onClick={() => setMobileMenuOpen(false)}>
                        Products
                      </Link>
                      <Link to="/admin/categorylist" className="block text-white py-1.5" onClick={() => setMobileMenuOpen(false)}>
                        Categories
                      </Link>
                      <Link to="/admin/orderlist" className="block text-white py-1.5" onClick={() => setMobileMenuOpen(false)}>
                        Orders
                      </Link>
                      <Link to="/admin/userlist" className="block text-white py-1.5" onClick={() => setMobileMenuOpen(false)}>
                        Users
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Profile & Logout */}
            <div className="mt-auto border-t border-gray-700 p-4">
              {userInfo ? (
                <>
                  <Link to="/profile" className="flex items-center text-white py-2 mb-2" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={logoutHandler} className="w-full text-left text-pink-500 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                    <AiOutlineLogin size={24} className="mr-3" />
                    <span>Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center text-white py-2" onClick={() => setMobileMenuOpen(false)}>
                    <AiOutlineUserAdd size={24} className="mr-3" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

export default Navigation;
