
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DashboardViewer = () => {
  const { type } = useParams(); // 'voter' or 'media'
  const [iframeUrl, setIframeUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/dashboard/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
     
          }
        );
        setIframeUrl(response.data.iframeUrl);
      } catch (err) {
        setError('Failed to load dashboard.');
        console.error(err);
      }
    };

    fetchDashboard();
  }, [type]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!iframeUrl) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 p-4">
<iframe
    src={iframeUrl}

    frameBorder="0"
    width="100%"
    height="100%"
    title={`${type} dashboard`}
    className="rounded-lg shadow-lg max-w-full"
    allowTransparency
/>
     

    </div>
  );
};

export default DashboardViewer;

