import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardCard from '../componenets/Welcome/Dashboardcard';

const DashboardSelector = () => {
  const [selected, setSelected] = useState(null);
  const user = useSelector((state) => state.user.user); // From Redux

  const handleSelect = (type) => {
    setSelected(type);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => handleSelect('voter')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voter
        </button>
        <button
          onClick={() => handleSelect('media')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Media
        </button>
      </div>

      <div className="flex justify-center items-center h-[70vh]">
        {selected && (
          <DashboardCard
            type={selected}
            state={user?.state || 'your state'}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardSelector;
