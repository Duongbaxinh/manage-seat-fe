import React from "react";

const Dashboard = () => {
  const stats = {
    floors: {
      total: 6,
      assigned: 2,
      unassigned: 4,
    },
    halls: {
      total: 4,
      available: 4,
      occupied: 0,
    },
    seats: {
      total: 20,
      assigned: 12,
      unassigned: 6,
      maintenance: 2,
    },
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Floor Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">
                Total Floors
              </h3>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.floors.total}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Assigned</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.floors.assigned}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700">Unassigned</h3>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {stats.floors.unassigned}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Hall Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700">
                Total Halls
              </h3>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.halls.total}
              </p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-emerald-700">
                Available
              </h3>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {stats.halls.available}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-700">Occupied</h3>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {stats.halls.occupied}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Seat Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-700">
                Total Seats
              </h3>
              <p className="text-3xl font-bold text-indigo-900 mt-2">
                {stats.seats.total}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700">Assigned</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.seats.assigned}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700">Unassigned</h3>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {stats.seats.unassigned}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-700">
                Maintenance
              </h3>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {stats.seats.maintenance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
