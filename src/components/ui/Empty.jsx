import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by adding your first item.", 
  actionText = "Add Item",
  onAction,
  icon = "Plus",
  showAction = true 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showAction && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name={icon} size={20} className="mr-2" />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;