import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, children }) => {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-500">
              {currentDate}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {children}
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full"></span>
          </Button>

          {/* Profile */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;