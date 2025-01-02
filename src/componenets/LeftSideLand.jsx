import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeftDashboard = () => {
    const [metrics, setMetrics] = useState({
        walletAmount: 0,
        postCount: 0,
        totalLikes: 0,
        totalDislikes: 0,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('/api/user/metrics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setMetrics(response.data);
            } catch (error) {
                console.error("Error fetching metrics", error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="p-4 space-y-4">
            {/* Wallet Box */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <p className="text-sm font-medium">Wallet Balance</p>
                <p className="text-lg font-bold text-green-600">{metrics.walletAmount}</p>
            </div>

            {/* Reactions Box */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <p className="text-sm font-medium">Reactions</p>
                <div className="flex items-center space-x-3 mt-2">
                    <span>👍 {metrics.totalLikes}</span>
                    <span>❤️ {metrics.totalDislikes}</span>
                </div>
            </div>

            {/* Posts Count */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <p className="text-sm font-medium">Posts</p>
                <p className="text-lg font-bold text-blue-600">{metrics.postCount}</p>
            </div>
        </div>
    );
};

export default LeftDashboard;
