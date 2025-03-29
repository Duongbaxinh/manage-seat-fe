import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAnalytics } from "react-icons/md";
import { PiPlus } from "react-icons/pi";
import { Link } from "react-router-dom";
import Popup from "../components/atom/Popup";
import { DeleteIcon, EditIcon } from "../icons";

const ApprovingDiagram = () => {
    const [diagrams, setDiagrams] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);

    const {

        reset,
        formState: { errors },
    } = useForm();

    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        console.log("check access", token)
        try {

            const floorRes = await axios.get("http://localhost:8080/diagram/all", {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            })
            console.log(floorRes.data)
            setDiagrams(floorRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            const token = localStorage.getItem("accessToken");
            try {
                await axios.delete(`http://localhost:8080/diagram/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                });
                setDiagrams(diagrams.filter((diagram) => diagram.id !== id));
            } catch (error) {
                console.error("Error deleting diagram:", error);
            }
        }
    };

    const onSubmit = async (data) => {
        const token = localStorage.getItem("accessToken");

        try {

            await axios.post("http://localhost:8080/diagram", data, {
                headers: { Authorization: `Bearer ${JSON.parse(token)}` },
            });

            fetchData();

            reset();
        } catch (error) {
            console.error("Error saving diagram:", error);
        }
    };

    return (
        <div className="p-5">

            <div className="flex flex-col justify-start items-start gap-3 mb-2">
                <h1 className="text-2xl font-bold">Rooms Management</h1>
                <div className="flex items-center gap-2  bg-blue-500 text-white rounded-sm px-3">
                    <button onClick={() => { }}
                        className="  py-2  ">
                        <PiPlus />
                    </button>
                    <p>Add new roomo</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg  max-h-[700vh] overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="h-[40px]">
                            <th className="text-left px-3 ">Name</th>
                            <th className="text-left px-3 ">SeatAvailable</th>
                            <th className="text-left px-3 ">Capacity</th>
                            <th className="text-left px-3 ">Owner</th><th className="text-left px-3 ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diagrams.map((diagram) => (
                            <tr key={diagram.id} className="h-[50px] border-b-[1px]">
                                <td className="px-3">{diagram.roomId}</td>
                                <td className="px-3">{diagram?.seats?.length ?? 0}</td>
                                <td className="px-3">{diagram?.capacity ?? 0}</td>
                                <td className="px-3">{diagram?.chief?.username ?? "-"}</td>
                                <td className="px-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => { }}><EditIcon className="text-blue-300" /></button>
                                        <button onClick={() => handleDelete(diagram.id)}><DeleteIcon className="text-red-300" /></button>
                                        <Link to={`/seat-management/${diagram.id}`}><MdAnalytics /></Link>
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

export default ApprovingDiagram;
