import React, { useState } from 'react';
import FloorModal from '../components/FloorModal';

const FloorManagement = () => {
  const [floors, setFloors] = useState([
    { id: 1, name: 'Floor 1', status: 'Assigned' },
    { id: 2, name: 'Floor 2', status: 'Unassigned' },
    { id: 3, name: 'Floor 3', status: 'Unassigned' },
    { id: 4, name: 'Floor 4', status: 'Unassigned' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);

  const handleEdit = (floor) => {
    setEditingFloor(floor);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setFloors(floors.filter(floor => floor.id !== id));
  };

  const handleAddFloor = () => {
    setEditingFloor(null);
    setIsModalOpen(true);
  };

  const handleSaveFloor = (floorData) => {
    if (editingFloor) {
      // Edit existing floor
      setFloors(floors.map(floor => 
        floor.id === editingFloor.id ? { ...floorData, id: floor.id } : floor
      ));
    } else {
      // Add new floor
      const newId = floors.length > 0 ? Math.max(...floors.map(f => f.id)) + 1 : 1;
      setFloors([...floors, { ...floorData, id: newId }]);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Floor Management</h1>
        <div className="space-x-2">
          <button
            onClick={handleAddFloor}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Floor
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {floors.map((floor) => (
              <tr key={floor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {floor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                    floor.status === 'Assigned' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {floor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(floor)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(floor.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FloorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFloor}
        floor={editingFloor}
      />
    </>
  );
};

export default FloorManagement;
