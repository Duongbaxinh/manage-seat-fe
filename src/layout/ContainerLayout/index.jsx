import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

function ContainerLayout({ isHeader = true, isSidebar = false, children }) {
    return (
        <div>
            {isHeader && (<Header />)}
            <div className="flex">
                {isSidebar && (<Sidebar />)}
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ContainerLayout;