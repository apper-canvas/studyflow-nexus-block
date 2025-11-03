import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-4 p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3 p-6">
        <div className="animate-pulse">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1 max-w-xs"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <motion.div
          className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;