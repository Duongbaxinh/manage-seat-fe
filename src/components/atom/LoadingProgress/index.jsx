import React, { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

function LoadingProgress({ loading }) {
    const ref = useRef(null);
    useEffect(() => {
        if (loading) {
            ref.current.continuousStart();
        } else {
            ref.current.complete();
        }
    }, [loading]);

    return <LoadingBar color="#6897fd" ref={ref} />;
}

export default LoadingProgress;