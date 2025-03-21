import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // List of admin navigation items
  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/categorylist", label: "Categories" },
    { path: "/admin/productlist", label: "Add Product" },
    { path: "/admin/allproductslist", label: "All Products" },
    { path: "/admin/userlist", label: "Users" },
    { path: "/admin/orderlist", label: "Orders" }
  ];

  return (
    <div className="relative z-20" ref={menuRef}>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-20 bg-[#151515] p-2 rounded-lg shadow-lg md:hidden"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={20} />
        ) : (
          <FaBars color="white" size={20} />
        )}
      </button>
      
      {/* Menu container - sidebar on desktop, overlay on mobile */}
      <div className={`
        fixed md:static 
        ${isMenuOpen ? 'inset-0 bg-black/50 flex md:bg-transparent' : 'hidden md:block'} 
        transition-all duration-300 md:min-h-screen
      `}>
        <div className={`
          bg-[#151515] 
          w-[250px] md:w-[220px] lg:w-[250px]
          min-h-screen
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ml-auto md:ml-0
        `}>
          <div className="p-4 md:p-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">Admin Panel</h2>
              <button 
                onClick={toggleMenu}
                className="text-white md:hidden"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {adminLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      className={({ isActive }) => `
                        flex items-center py-3 px-4 rounded-md transition-colors
                        ${isActive ? 'bg-pink-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
                      `}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;

















