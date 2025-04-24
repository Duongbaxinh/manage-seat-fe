import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNoticeContext } from '../context/notice.context';
import LoadingPage from './LoadingPage';

const ApprovingDiagram = () => {
    const { diagrams, setDiagrams } = useNoticeContext();
    const [loading, setLoading] = useState(false)


    if (loading) return <LoadingPage loading={loading} />

    return (
        <div className="p-5">
            {/* <LoadingProgress loading={loading} /> */}
            {diagrams && diagrams.length > 0 ?
                (
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

                                                    <Link to={`/view-diagram/${diagram.roomId}`}>
                                                        Detail
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center justify-center h-full text-center">
                        <img src="/bg_approve.png" alt="background" className=" w-ful max-w-screen max-h-screen h-auto mb-6" />

                    </div>
                )}
        </div>
    );
};

export default ApprovingDiagram;
