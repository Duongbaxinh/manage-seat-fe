import React from 'react';
import { URL_DASHBOARD } from '../config';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-[250px] h-[100vh] bg-white pt-6">
            <h1 className='px-2 py-2 uppercase text-[25px] font-bold '>Management</h1>
            {URL_DASHBOARD.map((item, index) => (
                <div key={index} className="w-full h-[40px] py-2 px-3 bg-blue-200 flex items-center gap-3">
                    {item.icon}<Link to={item.url}>{item.title}</Link>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;