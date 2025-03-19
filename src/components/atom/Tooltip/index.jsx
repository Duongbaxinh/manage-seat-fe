import React from 'react';

function ToolTip({ children }) {
    return (
        <div className='relative'>
            {children}

            <div className="absolute top-0 left-0 z-50">
                Hovering me
            </div>
        </div>
    );
}

export default ToolTip;