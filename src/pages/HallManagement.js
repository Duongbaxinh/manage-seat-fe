import React, { useState } from 'react';
import HallModal from '../components/HallModal';

const HallManagement = () => {
  const [halls, setHalls] = useState([
    { id: 1, name: 'Hall 1', capacity: 200, status: 'Available' },
    { id: 2, name: 'Hall 2', capacity: 200, status: 'Available' },
    { id: 3, name: 'Hall 3', capacity: 200, status: 'Available' },
    { id: 4, name: 'Hall 4', capacity: 200, status: 'Available' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState(null);

  const handleEdit = (hall) => {
    setEditingHall(hall);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setHalls(halls.filter(hall => hall.id !== id));
  };

  const handleAddHall = () => {
    setEditingHall(null);
    setIsModalOpen(true);
  };

  const handleSaveHall = (hallData) => {
    if (editingHall) {
      // Edit existing hall
      setHalls(halls.map(hall => 
        hall.id === editingHall.id ? { ...hallData, id: hall.id } : hall
      ));
    } else {
      // Add new hall
      const newId = halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1;
      setHalls([...halls, { ...hallData, id: newId }]);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assigned Halls</h1>
        <div className="space-x-2">
          <button
            onClick={handleAddHall}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Hall
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {halls.map((hall) => (
              <tr key={hall.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {hall.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {hall.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                    hall.status === 'Available' 
                      ? 'bg-green-100 text-green-800'
                      : hall.status === 'Occupied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {hall.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(hall)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hall.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHall}
        hall={editingHall}
      />
    </>
  );
};

export default HallManagement;
