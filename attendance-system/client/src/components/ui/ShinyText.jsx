import React from 'react';
import { motion } from 'framer-motion';

const ShinyText = ({ children }) => {
    return (
        <motion.span
            style={{
                backgroundImage: 'linear-gradient(100deg, #64CEFB 40%, #ffffff 50%, #64CEFB 60%)',
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
            }}
            animate={{ backgroundPositionX: ['0%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
            {children}
        </motion.span>
    );
};

export default ShinyText;
