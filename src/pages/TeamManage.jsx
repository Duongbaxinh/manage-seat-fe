import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiPlus } from 'react-icons/pi';
import Popup from '../components/atom/Popup';
import { DeleteIcon, EditIcon } from '../icons';

import { ClipLoader } from 'react-spinners';
import { handleAxiosError } from '../utils/handleError';

const TeamManage = () => {
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingTeam, setEditingTeam] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchTeams = async () => {
        setLoading(true)
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://seatmanage-be-v3.onrender.com/team', {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });
            setTeams(response.data.result);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            handleAxiosError(error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleEdit = (team) => {

        setEditingTeam(team);
        reset({ name: team.name, code: team.code });
        setIsModalOpen(true);
    };

    const handleAddTeam = () => {
        setEditingTeam(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa team này?')) {
            const token = localStorage.getItem('accessToken');
            try {
                await axios.delete(`https://seatmanage-be-v3.onrender.com/team/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                fetchTeams();
            } catch (error) {
                console.error('Error deleting team:', error);
            }
        }
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem('accessToken');
        try {
            if (editingTeam) {
                await axios.put(`https://seatmanage-be-v3.onrender.com/team/${editingTeam.id}`, data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            } else {
                await axios.post('https://seatmanage-be-v3.onrender.com/team', data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            }
            fetchTeams();
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error saving team:', error);
        }
    };

    return (
        <div className="p-5">
            <Popup
                title={editingTeam ? 'Edit Team' : 'Add Team'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="min-w-[400px] p-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Team Name</label>
                            <input
                                {...register('name', { required: 'Team name is required' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter team name"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Team Code</label>
                            <input
                                {...register('code', { required: 'Team code is required' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter team code"
                            />
                            {errors.code && <span className="text-red-500 text-sm">{errors.code.message}</span>}
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {editingTeam ? 'Update Team' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div className="flex flex-col justify-start items-start gap-3 mb-4">
                <h1 className="text-2xl font-bold">Team Management</h1>
                <div className="flex items-center gap-2 bg-blue-500 text-white rounded-sm px-3">
                    <button onClick={handleAddTeam} className="py-2">
                        <PiPlus />
                    </button>
                    <p>Add new Team</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg max-h-[80vh] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <th className="text-left px-3 py-2">Team Name</th>
                            <th className="text-left px-3 py-2">Team Code</th>
                            <th className="text-left px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-10">
                                    <ClipLoader color={"#6897fd"} loading={loading} size={50} />
                                </td>
                            </tr>
                        ) : (
                            teams.map((team) => (
                                <tr key={team.id} className="h-[50px] border-b-[1px] odd:bg-white even:bg-gray-100">
                                    <td className="p-4">{team.name}</td>
                                    <td className="p-4">{team.code}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(team)}>
                                                <EditIcon className="text-blue-300" />
                                            </button>
                                            <button onClick={() => handleDelete(team.id)}>
                                                <DeleteIcon className="text-red-300" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default TeamManage;
