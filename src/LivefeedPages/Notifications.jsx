import React from 'react'
import { Bell, CheckCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    message: "Your subscription has been approved!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    message: "You have a new message from Admin.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    message: "Your identity verification is pending.",
    time: "3 days ago",
    read: false,
  },
];

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`flex items-start p-4 rounded-xl shadow-md transition-all duration-300 ${
                note.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div className="pt-1">
                <CheckCircle
                  className={`w-6 h-6 ${
                    note.read ? "text-green-400" : "text-blue-500"
                  }`}
                />
              </div>
              <div className="ml-3">
                <p className="text-gray-700 font-medium">{note.message}</p>
                <p className="text-sm text-gray-500 mt-1">{note.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notifications