import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX, FiRadio, FiGlobe } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Live News", href: "/news" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }, 
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-900 to-blue-800 shadow-lg relative z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <Link to="/">
              <motion.div
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <FiRadio className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-xl font-bold">
                  AI News Anchor
                </span>
              </motion.div>
            </Link>
          </div>

         
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink 
                  to={item.href} 
                  key={item.name}
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-700/80'
                    }`
                  }
                >
                  <motion.span
                    className="block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.span>
                </NavLink>
              ))}
              <motion.button
                className="flex items-center text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGlobe className="mr-1" /> EN/UR
              </motion.button>
            </div>
          </div>

        
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink 
                  to={item.href} 
                  key={item.name}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-blue-700 text-white' 
                        : 'text-white hover:bg-blue-700/80'
                    }`
                  }
                >
                  <motion.span
                    className="block"
                    whileHover={{ backgroundColor: "rgba(29, 78, 216, 0.8)" }}
                  >
                    {item.name}
                  </motion.span>
                </NavLink>
              ))}
              <motion.button
                className="w-full flex items-center justify-center text-white bg-blue-600 px-3 py-2 rounded-md text-base font-medium mt-2"
                whileHover={{ scale: 1.02 }}
              >
                <FiGlobe className="mr-2" /> Switch Language (EN/UR)
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;