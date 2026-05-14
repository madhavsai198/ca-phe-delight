import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const IntroAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Prevent scrolling while intro is playing
    document.body.style.overflow = 'hidden';
    
    // Hide the animation after it completes
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }, 2500); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: [1, 1, 1, 0] }}
          transition={{ duration: 2.4, times: [0, 0.3, 0.8, 1], ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none"
        >
          <motion.img
            src="/logo.png"
            alt="Ca Phe Bistro Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1, 1, 8], opacity: [0, 1, 1, 0] }}
            transition={{ 
              duration: 2.4, 
              times: [0, 0.3, 0.6, 1], 
              ease: "easeInOut" 
            }}
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
