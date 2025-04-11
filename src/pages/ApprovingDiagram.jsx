import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { MdAnalytics } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useNoticeContext } from '../context/notice.context';
import { DeleteIcon, EditIcon } from '../icons';

const ApprovingDiagram = () => {
    const { diagrams, setDiagrams } = useNoticeContext();

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            const token = localStorage.getItem('accessToken');
            try {
                await axios.delete(`https://seatment-app-be-v2.onrender.com/diagram/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                setDiagrams(diagrams.filter((diagram) => diagram.id !== id));
            } catch (error) {
                console.error('Error deleting diagram:', error);
            }
        }
    };
    if (!diagrams) return <h1>Loading...</h1>
    console.log(diagrams);
    return (
        <div className="p-5">
            {diagrams && diagrams.length > 0 && (
                <div className="bg-white shadow rounded-lg  max-h-[700vh] overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="h-[40px]">
                                <th className="text-left px-3 ">Name</th>
                                <th className="text-left px-3 ">SeatAvailable</th>
                                <th className="text-left px-3 ">Capacity</th>
                                <th className="text-left px-3 ">Name</th>
                                <th className="text-left px-3 ">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diagrams.length > 0 &&
                                diagrams.map((diagram) => (
                                    <tr key={diagram.id} className="h-[50px] border-b-[1px]">
                                        <td className="px-3">{diagram.roomId}</td>
                                        <td className="px-3">{diagram?.seats?.length ?? 0}</td>
                                        <td className="px-3">{diagram?.capacity ?? 0}</td>
                                        <td className="px-3">{diagram?.name ?? '-'}</td>
                                        <td className="px-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => { }}>
                                                    <EditIcon className="text-blue-300" />
                                                </button>
                                                <button onClick={() => handleDelete(diagram.id)}>
                                                    <DeleteIcon className="text-red-300" />
                                                </button>
                                                <Link to={`/view-diagram/${diagram.roomId}`}>
                                                    <MdAnalytics />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApprovingDiagram;
