import React from 'react';
import { URL_DASHBOARD } from '../config';
import { Link } from 'react-router-dom';

const DashBoard = () => {
    return (
        <div className='flex gap-4'>
            <div className="w-[250px] h-[100vh] bg-white">
                {URL_DASHBOARD.map((item, index) => (
                    <div key={index} className="">
                        <Link to={item.url}>{item.title}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashBoard;