import { useRef, useEffect } from "react";

export default function useDebounced(func: any, delay: number, cleanUp = false) {
    const timeoutRef = useRef<any>();

    function clearTimer() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }

    useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);

    return (...args: any) => {
        clearTimer();
        timeoutRef.current = setTimeout(() => func(...args), delay);
    };
}