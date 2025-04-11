import React from 'react';
import { ClipLoader } from 'react-spinners';

function LoadingPage({ loading }) {
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <ClipLoader
                color={"#6897fd"}
                loading={loading}
                size={50}
            />
        </div>
    );
}

export default LoadingPage;