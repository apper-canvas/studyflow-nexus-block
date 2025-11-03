import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
    },
    {
      name: "Courses",
      href: "/courses",
      icon: "BookOpen",
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: "ClipboardList",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar",
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "Trophy",
    },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          size={20} 
          className={cn(
            "mr-3 transition-colors duration-200",
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
          )}
        />
        {item.name}
        
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 w-1 bg-white rounded-r-full"
            style={{ height: "60%" }}
          />
        )}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StudyFlow
              </h1>
              <p className="text-xs text-gray-500">Academic Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Student</p>
              <p className="text-xs text-gray-500">Current Semester</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      StudyFlow
                    </h1>
                    <p className="text-xs text-gray-500">Academic Manager</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>

              {/* Footer */}
              <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Student</p>
                    <p className="text-xs text-gray-500">Current Semester</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;