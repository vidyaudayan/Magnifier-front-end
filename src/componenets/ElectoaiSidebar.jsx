import React, { useState } from 'react';
import { X, Plus, HelpCircle } from 'lucide-react';
import { ChatData } from '../context/ChatContex';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";


function ElectoaiSidebar({ isSidebarOpen, toggleSidebar, setIsSidebarOpen }) {

    const { chats, createChat, setSelected, deleteChat } = ChatData()

    const deleteChatHandler = async (id) => {
        if (confirm("Are you sure you want to delete the chat?")) {
            await deleteChat(id); // ✅ Wait for deletion to finish
        }
    }
    

    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.clear()
        toast.success("logged out")
        navigate("/")
    }
    return (
        <>

            <div className="flex h-screen bg-gray-50">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div
                    className={`fixed lg:relative w-80 bg-white border-r border-gray-200 h-full flex flex-col z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    <div className="flex items-center justify-between p-4 lg:hidden">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <button onClick={createChat} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 mb-6 w-full">
                            <Plus className="w-5 h-5" />
                            <span>New chat</span>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-sm font-medium text-gray-500 mb-2">Recent</h2>
                            <div className='mb-20 md:mb-0 max-h-[500px] overflow-y-auto thin-scrollbar'>

                                {
                                    chats && chats.length > 0 ? chats.map((e) => (
                                        <div key={e._id} className='w-full text-left px-2 py-2 mt-2 bg-gray-100 hover:bg-blue-500 rounded flex justify-between items-center' onClick={() => setSelected(e._id)} >
                                            <span className='text-gray-700'>{e.latestMessage.slice(0, 38)}...</span>
                                            <button
                                                className="bg-red-600 text-white text-3xl px-3 py-2 rounded-md hover:bg-red-800"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 🛑 Stop it from triggering parent div
                                                    deleteChatHandler(e._id);
                                                }}
                                            >
                                                <MdDelete />
                                            </button>

                                        </div>
                                    )) : <p className='text-black font-bold'> No chats yet</p>
                                }

                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-4 flex flex-row justify-between items-center">
                        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700">
                            <HelpCircle className="w-4 h-4" />
                            <span>Help</span>
                        </button>
                        <button onClick={logoutHandler} className="bg-red-500 text-white text-sm px-4 py-2 rounded-full hover:bg-red-800">
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ElectoaiSidebar;
