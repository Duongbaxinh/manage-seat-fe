import { useEffect } from "react";

const useKeyboardShortcuts = (callback) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === "c") {
                callback("copy", "keydown");
            } else if (event.ctrlKey && event.key === "v") {
                callback("paste", "keydown");
            } else if (event.shiftKey && !event.ctrlKey) {
                callback("shift", "keydown");
            } else if (event.ctrlKey && event.shiftKey) {
                callback("ctrl+shift", "keydown");
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === "Control") {
                callback("ctrl", "keyup");
            } else if (event.key === "Shift") {
                callback("shift", "keyup");
            } else if (event.key === "c" && event.ctrlKey) {
                callback("copy", "keyup");
            } else if (event.key === "v" && event.ctrlKey) {
                callback("paste", "keyup");
            } else if (event.key === "Shift" && event.ctrlKey) {
                callback("ctrl+shift", "keyup");
            }
        };


        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [callback]);
};

export default useKeyboardShortcuts;
