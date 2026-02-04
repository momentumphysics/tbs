import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageModal({ isOpen, onClose, images, alt }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') paginate(1);
            if (e.key === 'ArrowLeft') paginate(-1);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
            setCurrentIndex(0);
            setDirection(0);
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const paginate = (newDirection) => {
        if (images.length <= 1) return;
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4"
                    >

                        {/* Main Content Area - Fixed height container for absolute images */}
                        <div
                            className="relative w-full h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.img
                                    key={currentIndex}
                                    src={images[currentIndex]}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);

                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing rounded-lg shadow-2xl z-10 m-auto"
                                    alt={`${alt} - View ${currentIndex + 1}`}
                                />
                            </AnimatePresence>

                            {/* Close Button - Inside (Top Right) */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all z-50 group/close backdrop-blur-sm"
                                title="Close (Esc)"
                            >
                                <svg className="w-8 h-8 transform group-hover/close:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Image Counter - Inside (Bottom) */}
                            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/90 font-medium bg-black/30 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm border border-white/10 pointer-events-none z-50">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </div>

                        {/* Desktop Previous Button - Closer */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 group"
                                title="Previous Image"
                            >
                                <svg className="w-12 h-12 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Desktop Next Button - Closer */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 group"
                                title="Next Image"
                            >
                                <svg className="w-12 h-12 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}

                        {/* Mobile Swipe Hint */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs md:hidden pointer-events-none">
                            Swipe to navigate
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
