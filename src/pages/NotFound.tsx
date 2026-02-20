// pages/NotFound.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4"
    >
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <AlertCircle size={48} className="text-red-500 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="mb-2 text-4xl font-bold text-[#0d2233] dark:text-[#ddeef7]">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-[#2a7db5]">Page Not Found</h2>
        
        <p className="mb-8 text-[#5c85a0] dark:text-[#7a9baf]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ccdfe9] bg-white px-4 py-2 text-sm font-medium text-[#5c85a0] transition-all hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] dark:border-[#1a2d3e] dark:bg-[#0d1e2d] dark:text-[#7a9baf] dark:hover:bg-[#0d1a26]"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2a7db5] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#1e5f8e]"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;