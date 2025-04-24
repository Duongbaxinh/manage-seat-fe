import React, { createContext, useContext, useState, useEffect } from "react";

const SeatMapContext = createContext();

export const SeatMapContextProvider = ({ children }) => {
    const [targetId, setTargetId] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const goToTarget = (id) => {
        setTargetId(id);
        setIsActive(true);
    };


    useEffect(() => {
        if (!isActive || !targetId) return;

        const target = document.querySelector(targetId); // Find the seat element
        if (!target) {
            console.error(`Element with ID ${targetId} not found!`);
            setIsActive(false);
            return;
        }

        // Highlight the target (optional)
        target.style.border = '3px solid red';


        target.style.zIndex = '50';

        // Find the scrollable container (the red-bordered div)
        const container = target.closest('.overflow-auto'); // Adjust selector if needed
        if (!container) {
            console.error('Scrollable container not found!');
            setIsActive(false);
            return;
        }

        // Get the bounding rectangles of the target and the container
        const targetRect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate the seat's position relative to the container's scroll position
        const targetLeftRelative = targetRect.left - containerRect.left + container.scrollLeft;
        const targetTopRelative = targetRect.top - containerRect.top + container.scrollTop;

        // Calculate the container's visible dimensions (excluding scrollbars)
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate the scroll position to center the seat in the container
        const scrollLeft = targetLeftRelative + (targetRect.width / 2) - (containerWidth / 2);
        const scrollTop = targetTopRelative + (targetRect.height / 2) - (containerHeight / 2);

        // Account for the fixed header height (to ensure the seat isn't obscured)
        const header = document.querySelector('.header'); // Adjust selector based on your actual header class
        const headerHeight = header ? header.offsetHeight : 60; // Fallback to 60px if header not found
        const adjustedScrollTop = scrollTop - headerHeight;

        // Ensure the scroll positions don't go negative or exceed the container's scrollable area
        const maxScrollLeft = container.scrollWidth - containerWidth;
        const maxScrollTop = container.scrollHeight - containerHeight;

        const finalScrollLeft = Math.max(0, Math.min(scrollLeft, maxScrollLeft));
        const finalScrollTop = Math.max(0, Math.min(adjustedScrollTop, maxScrollTop));


        container.scrollTo({
            left: finalScrollLeft,
            top: finalScrollTop,
            behavior: 'smooth'
        });


        setIsActive(false);


        return () => {
            if (target) {
                target.style.outline = 'none';
                target.style.zIndex = '0';
            }
        };
    }, [isActive, targetId]);

    return (
        <SeatMapContext.Provider value={{ goToTarget }}>
            {children}
        </SeatMapContext.Provider>
    );
};

export const useSeatMap = () => {
    const context = useContext(SeatMapContext);
    if (!context) {
        throw new Error("useOnboardingGuide must be used inside an SeatMapContextProvider");
    }
    return context;
};