import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BackButtonProps {
  to?: string | number;
  className?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to = -1,
  className = '',
  label,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    if (typeof to === 'string') {
      navigate(to);
    } else {
      navigate(to); 
    }
  };

  const isRTL = i18n.language === 'ar';
  const arrowClassName = `h-4 w-4 transition-transform ${isRTL ? 'rotate-180' : ''}`;

  return (
    <motion.button
      initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-full px-26 py-3 text-base font-semibold bg-[#2a7db5] text-white shadow-lg transition-all duration-300 hover:bg-[#1e6fa0] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2a7db5] focus:ring-offset-2 dark:focus:ring-offset-[#0a1520] ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      aria-label={label || t('back')}
    >
      <ArrowLeft className={arrowClassName} />
      {label && <span>{label}</span>}
    </motion.button>
  );
};

export default BackButton;