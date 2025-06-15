import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const navItems = Object.values(routes).filter(route => route.showInNav);
  const floatingCreate = navItems.find(item => item.isFloating);
  const bottomNavItems = navItems.filter(item => !item.isFloating);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-40 md:hidden">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}
                  >
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={isActive ? 'text-primary' : 'text-gray-500'}
                    />
                  </motion.div>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Floating Create Button */}
      {floatingCreate && (
        <NavLink to={floatingCreate.path}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 gradient-primary rounded-full shadow-lg flex items-center justify-center z-50"
          >
            <ApperIcon name="Plus" size={24} className="text-white" />
          </motion.button>
        </NavLink>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gray-200 z-40">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-secondary">Nexus</h1>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.filter(item => !item.isFloating).map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={isActive ? 'text-white' : 'text-gray-500'}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop Main Content Wrapper */}
      <div className="hidden md:block ml-64">
        {/* This ensures proper spacing for desktop layout */}
      </div>
    </div>
  );
};

export default Layout;