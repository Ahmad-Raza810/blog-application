import { Variants } from 'framer-motion';

/**
 * Animation utilities for Content Hub
 * Reusable framer-motion variants and configurations
 */

// Page transition animations
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

// Fade in animation
export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Slide up animation
export const slideUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Slide in from left
export const slideInLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Slide in from right
export const slideInRight: Variants = {
    hidden: {
        opacity: 0,
        x: 50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Stagger container for lists
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Stagger item
export const staggerItem: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Scale animation
export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

// Hover lift effect
export const hoverLift = {
    rest: {
        y: 0,
        scale: 1,
    },
    hover: {
        y: -5,
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Button tap animation
export const buttonTap = {
    scale: 0.95,
    transition: {
        duration: 0.1,
    },
};

// Shake animation for errors
export const shake: Variants = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
        },
    },
};

// Modal animations
export const modalBackdrop: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
        },
    },
};

export const modalContent: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: {
            duration: 0.2,
        },
    },
};

// Navbar animation
export const navbarVariants: Variants = {
    hidden: {
        y: -100,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Card hover animation
export const cardHover = {
    rest: {
        scale: 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    hover: {
        scale: 1.03,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

// Gradient text animation
export const gradientText = {
    backgroundSize: '200% 200%',
    animation: 'gradient 3s ease infinite',
};

// Spring animation config
export const springConfig = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
};
