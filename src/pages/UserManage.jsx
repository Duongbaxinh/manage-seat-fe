import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdAnalytics } from 'react-icons/md';
import { PiPlus } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import Popup from '../components/atom/Popup';
import { DeleteIcon, EditIcon } from '../icons';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditUser] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const [roleRes, userRes, teamRes, roomRes] = await Promise.all([
                axios.get('https://seatment-app-be-v2.onrender.com/role', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatment-app-be-v2.onrender.com/user', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatment-app-be-v2.onrender.com/team', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatment-app-be-v2.onrender.com/room', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
            ]);
            setRoles(roleRes.data.result);
            setUsers(userRes.data.result);
            setTeams(teamRes.data.result);
            setRooms(roomRes.data.result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        reset(user);
        setIsModalOpen(true);
    };

    const handleAddUser = () => {
        setEditUser(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            const token = localStorage.getItem('accessToken');
            try {
                await axios.delete(`https://seatment-app-be-v2.onrender.com/user/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                fetchData()
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const onSubmit = async (data) => {

        const token = localStorage.getItem('accessToken');
        try {
            if (editingUser) {
                await axios.put(`https://seatment-app-be-v2.onrender.com/user/${editingUser.id}`, data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            } else {
                await axios.post('https://seatment-app-be-v2.onrender.com/auth/register', data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            }

            fetchData(); // Refresh data
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const getNameRoom = (roomId) => {
        const findRoom = rooms.find(room => room.id === roomId)
        return findRoom ? findRoom.name : "-"
    }
    return (
        <div className="p-5">
            <Popup
                title={editingUser ? 'Edit user' : 'Add user'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="min-w-[600px] p-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input
                                {...register('firstName')}
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter first name"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                {...register('lastName')}
                                type="text"
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter last name"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">User Name</label>
                            <input
                                {...register('username', {
                                    required: 'Username is required',
                                    pattern: {
                                        value: /^[a-zA-Z][a-zA-Z0-9]{2,19}$/,
                                        message: 'Username must (3-20 chars)',
                                    },
                                })}
                                type="text"
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-sm">{errors.username.message}</span>
                            )}
                        </div>

                        {!editingUser && (
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    {...register('password', {
                                        required: 'Password is required',
                                        pattern: {
                                            value: /^(?=.*[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s<>]{8,16}$/,
                                            message:
                                                'Password must be 8-16 characters, include letters, numbers, or symbols.',
                                        },
                                    })}
                                    type="password"
                                    className="border rounded-md px-2 py-1 shadow-md"
                                    placeholder="Enter password"
                                />
                                {errors.password && (
                                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                                )}
                            </div>

                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">team</label>
                            <select
                                {...register('teamId')}
                                className="border rounded-md px-2 py-1 shadow-md"
                            >
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}{' '}
                                    </option>
                                ))}
                            </select>
                            {errors.name && (
                                <span className="text-red-500 text-sm">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <select
                                {...register('roleName', { required: 'Please select a role' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                            >
                                <option className="hidden" value="">Select role</option>
                                {roles.map((role) => (
                                    <option key={role.name} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roleName && (
                                <span className="text-red-500 text-sm">{errors.roleName.message}</span>
                            )}
                        </div>


                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Room</label>
                            <select
                                {...register('roomId', { required: 'Please select a room' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                            >
                                <option className="hidden" value="">Select room</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roomId && (
                                <span className="text-red-500 text-sm">{errors.roomId.message}</span>
                            )}
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
                                {editingUser ? 'Update user' : 'Create user'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div className="flex flex-col justify-start items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold">Account Management</h1>
                <div className="flex items-center gap-2  bg-blue-500 text-white rounded-sm px-3">
                    <button onClick={handleAddUser} className="  py-2  ">
                        <PiPlus />
                    </button>
                    <p>Add new Account</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg  max-h-[80vh] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <th className="text-left px-3 py-2">First Name</th>
                            <th className="text-left px-3 py-2">Last Name</th>
                            <th className="text-left px-3 py-2">Username</th>
                            <th className="text-left px-3 py-2">Room</th>
                            <th className="text-left px-3 py-2">Team</th>
                            <th className="text-left px-3 py-2">Role</th>
                            <th className="text-left px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="h-[50px] border-b-[1px] odd:bg-white even:bg-gray-100">
                                <td className="p-4">{user.firstName}</td>
                                <td className="p-4">{user.lastName}</td>
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">{getNameRoom(user.roomId)}</td>
                                <td className="p-4">{user.team?.name ?? "-"}</td>
                                <td className="p-4">{user.role ?? "-"}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(user)}>
                                            <EditIcon className="text-blue-300" />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)}>
                                            <DeleteIcon className="text-red-300" />
                                        </button>
                                        <Link to={`/seat-management/${user.id}`}>
                                            <MdAnalytics />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManage;
