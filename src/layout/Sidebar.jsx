import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { URL_DASHBOARD } from '../config';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-[250px] h-[100vh] bg-white pt-6">
            <h1 className='px-2 py-2 uppercase text-[25px] font-bold'>Management</h1>
            {URL_DASHBOARD.map((item, index) => {
                const isActive = location.pathname === item.url;

                return (
                    <div
                        key={index}
                        className={`w-full h-[40px] py-2 px-3 flex items-center gap-3 cursor-pointer ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200'
                            }`}
                    >
                        {item.icon}
                        <Link to={item.url} className="w-full h-full">
                            {item.title}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
