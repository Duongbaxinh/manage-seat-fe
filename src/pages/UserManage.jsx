import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiPlus } from 'react-icons/pi';
import Popup from '../components/atom/Popup';
import { DeleteIcon, EditIcon } from '../icons';
import { ClipLoader } from 'react-spinners';
import { handleAxiosError } from '../utils/handleError';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingProcess, setLoadingProcess] = useState(false);
    const [teams, setTeams] = useState([]);
    const [projects, setProjects] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditUser] = useState(null);
    const [filters, setFilters] = useState({

    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchData = async () => {
        setLoading(true)
        const token = localStorage.getItem('accessToken');
        try {
            const [roleRes, userRes, teamRes, projectRes, roomRes] = await Promise.all([
                axios.get('https://seatmanage-be-v3.onrender.com/role', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatmanage-be-v3.onrender.com/user', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatmanage-be-v3.onrender.com/team', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatmanage-be-v3.onrender.com/project', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
                axios.get('https://seatmanage-be-v3.onrender.com/room', {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }),
            ]);
            setRoles(roleRes.data.result);
            setUsers(userRes.data.result);
            setTeams(teamRes.data.result);
            setProjects(projectRes.data.result);
            setRooms(roomRes.data.result)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            handleAddUser(error)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        reset({
            firstName: user?.firstName,
            lastName: user?.lastName,
            roleName: user?.role,
            teamId: user?.team?.id,
            projectId: user?.project?.id,
            roomId: user?.roomId
        });
        setIsModalOpen(true);
    };

    const handleAddUser = () => {

        setEditUser(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setLoadingProcess(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            const token = localStorage.getItem('accessToken');
            try {
                await axios.delete(`https://seatmanage-be-v3.onrender.com/user/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                setLoadingProcess(false)
                fetchData()
            } catch (error) {
                setLoadingProcess(false)
                handleAxiosError(error)

            }
        }
    };

    const onSubmit = async (data) => {
        setLoadingProcess(true)
        const token = localStorage.getItem('accessToken');
        try {
            if (editingUser) {
                await axios.put(`https://seatmanage-be-v3.onrender.com/user/${editingUser.id}`, data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            } else {
                await axios.post('https://seatmanage-be-v3.onrender.com/auth/register', data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            }

            fetchData();
            setIsModalOpen(false);
            setLoadingProcess(false)
            reset();
        } catch (error) {
            setLoadingProcess(false)
            handleAxiosError(error)
        }
    };

    const getNameRoom = (roomId) => {
        const findRoom = rooms.find(room => room.id === roomId)
        return findRoom ? findRoom.name : "-"
    }
    const handleSetFilter = ({ filed, value }) => {
        setFilters(prev => ({ ...prev, [filed]: value ? value : null }))
    }
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const authentication =
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }
        const fetchData = async () => {
            try {

                const response = await axios.get(`https://seatmanage-be-v3.onrender.com/user/filter?teamId=${filters?.teamId}&projectId=${filters?.projectId ?? null}`, authentication);
                console.log("run data ", response.data)
                setUsers(response.data.result);
            } catch (error) {
                handleAxiosError(error)
            }
        };

        fetchData();
    }, [filters]);

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


                        {!editingUser && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        {...register('username', { required: true })}
                                        type="text"
                                        className="border rounded-md px-2 py-1 shadow-md"
                                        placeholder="Enter password"
                                    />
                                    {errors.username && (
                                        <span className="text-red-500 text-sm">{errors.username.message}</span>
                                    )}
                                </div>
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
                            </>


                        )}

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Team</label>
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
                            <label className="text-sm font-medium text-gray-700">Project</label>
                            <select
                                {...register('projectId')}
                                className="border rounded-md px-2 py-1 shadow-md"
                            >
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}{' '}
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
                                disabled={loadingProcess}
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-[0.5]"
                            >
                                {editingUser ? 'Update user' : 'Create user'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div className="flex flex-col justify-start items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold">Account Management</h1>
                <div className="flex items-center gap-2 h-[40px] text-white rounded-sm px-3">
                    <button onClick={handleAddUser} className=" bg-blue-500 py-2 h-full px-1 rounded-md">
                        Add new Account
                    </button>
                    <select className='h-full text-black rounded-md' value={filters?.teamId ?? ""} onChange={(e) => handleSetFilter({ filed: "teamId", value: e.target.value })}  >
                        <option value="">Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}{' '}
                            </option>
                        ))}
                    </select>
                    <select className='h-full text-black rounded-md' value={filters?.projectId ?? ""} onChange={(e) => handleSetFilter({ filed: "projectId", value: e.target.value })}  >
                        <option value="">Project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}{' '}
                            </option>
                        ))}
                    </select>
                    {(filters.teamId !== "" || filters.projectId !== "") > 0 && <button onClick={() => setFilters({ teamId: "", projectId: "" })} className='bg-red-500 text-white px-2 py-1 rounded-md h-full'>Reset</button>}
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
                            <th className="text-left px-3 py-2">Project</th>
                            <th className="text-left px-3 py-2">Role</th>
                            <th className="text-left px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center py-10">
                                    <ClipLoader color={"#6897fd"} loading={loading} size={50} />
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="h-[50px] border-b-[1px] odd:bg-white even:bg-gray-100">
                                    <td className="p-4">{user.firstName}</td>
                                    <td className="p-4">{user.lastName}</td>
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4">{getNameRoom(user.roomId)}</td>
                                    <td className="p-4">{user.team?.name ?? "-"}</td>
                                    <td className="p-4">{user.project?.name ?? "-"}</td>
                                    <td className="p-4">{user.role ?? "-"}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(user)}>
                                                <EditIcon className="text-blue-300" />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)}>
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

export default UserManage;
