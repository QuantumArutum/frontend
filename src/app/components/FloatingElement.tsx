import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  icon: string;
  idx: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ icon, idx }) => {
  return (
    <motion.div
      key={idx}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 3 + idx * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: idx * 0.5,
      }}
      className="absolute w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center text-2xl"
      style={{
        top: `${20 + (idx % 3) * 30}%`,
        left: `${10 + (idx % 2) * 80}%`,
      }}
    >
      {icon}
    </motion.div>
  );
};

export default FloatingElement;
