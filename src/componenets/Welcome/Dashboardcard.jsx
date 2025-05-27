import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ type, state }) => {
  const navigate = useNavigate();

  const imgSrc =
    type === 'voter'
      ? 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png'
      : 'https://cdn-icons-png.flaticon.com/512/2989/2989989.png';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
      <img
        src={imgSrc}
        alt={`${type} dashboard`}
        className="mx-auto h-32 w-32 mb-4"
      />
      <h3 className="text-xl font-semibold mb-2 capitalize">
        {type} Dashboard for {state}
      </h3>
      <button
        onClick={() => navigate(`/dashboard/${type}`)}
        className="mt-4 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        View Dashboard
      </button>
    </div>
  );
};

export default DashboardCard;