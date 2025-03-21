"use client";
import { useState, useEffect } from "react";

const useSaveLocalStorage = (key, initialValue) => {
    const [state, setState] = useState(() => {
        if (typeof window !== "undefined") {
            const savedState = localStorage.getItem(key);
            return savedState !== null && savedState !== "undefined"
                ? JSON.parse(savedState)
                : initialValue;
        }
        return initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

export default useSaveLocalStorage;
