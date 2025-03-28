import { useEffect, useCallback } from "react";

const useClickOutside = (refs, callback) => {
    const handleClickOutside = useCallback(
        (event) => {
            if (
                refs.every(
                    (ref) => ref.current && !ref.current.contains(event.target)
                )
            ) {
                callback();
            }
        },
        [refs, callback]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);
};

export default useClickOutside;
