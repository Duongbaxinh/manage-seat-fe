import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiPlus } from 'react-icons/pi';
import Popup from '../components/atom/Popup';
import { DeleteIcon, EditIcon } from '../icons';
import { handleAxiosError } from '../utils/handleError';
import { ClipLoader } from 'react-spinners';

const ProjectManage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [loading, setLoading] = useState(true);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchProjects = async () => {
        setLoading(true)
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://seatmanage-be-v3.onrender.com/project', {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });
            setProjects(response.data.result);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            handleAxiosError(error)
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleEdit = (project) => {
        const { id, ...rest } = project;
        setEditingProject(project);
        reset(rest);
        setIsModalOpen(true);
    };

    const handleAddProject = () => {
        setEditingProject(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa project này?')) {
            const token = localStorage.getItem('accessToken');
            try {
                await axios.delete(`https://seatmanage-be-v3.onrender.com/project/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem('accessToken');
        try {
            if (editingProject) {
                await axios.put(`https://seatmanage-be-v3.onrender.com/project/${editingProject.id}`, data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                setEditingProject(false)
            } else {
                await axios.post('https://seatmanage-be-v3.onrender.com/project', data, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
            }
            fetchProjects();
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    return (
        <div className="p-5">
            <Popup
                title={editingProject ? 'Edit Project' : 'Add Project'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="min-w-[400px] p-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Project Name</label>
                            <input
                                {...register('name', { required: 'Project name is required' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter project name"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                className="border rounded-md px-2 py-1 shadow-md"
                                placeholder="Enter project description"
                            />
                            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
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
                                {editingProject ? 'Update Project' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div className="flex flex-col justify-start items-start gap-3 mb-4">
                <h1 className="text-2xl font-bold">Project Management</h1>
                <div className="flex items-center gap-2 bg-blue-500 text-white rounded-sm px-3">
                    <button onClick={handleAddProject} className="py-2">
                        <PiPlus />
                    </button>
                    <p>Add new Project</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg max-h-[80vh] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <th className="text-left px-3 py-2">Project Name</th>
                            <th className="text-left px-3 py-2">Description</th>
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
                            projects.map((project) => (
                                <tr key={project.id} className="h-[50px] border-b-[1px] odd:bg-white even:bg-gray-100">
                                    <td className="p-4">{project.name}</td>
                                    <td className="p-4">{project.description}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(project)}>
                                                <EditIcon className="text-blue-300" />
                                            </button>
                                            <button onClick={() => handleDelete(project.id)}>
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

export default ProjectManage;
