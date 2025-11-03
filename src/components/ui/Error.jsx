import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-danger-100 to-danger-50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={40} className="text-danger-500" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={20} className="mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;