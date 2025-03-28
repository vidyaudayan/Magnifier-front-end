import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarLanding from '../componenets/NavbarLanding';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${query}`);
          setResults(response.data.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [query]);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}/posts`);
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <NavbarLanding/>
      <h2 className="text-2xl pt-32 p-2 font-bold text-gray-800 mb-6">Search Results for "{query}"</h2>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="flex items-center p-4 bg-white shadow-lg rounded-xl cursor-pointer hover:bg-violet-200 transition duration-300"
            >
              <img
                src={user.profilePic || '/default-avatar.png'}
                alt={user.username}
                className="w-14 h-14 rounded-full object-fill border-2 border-gray-300"
              />
              <p className="ml-4 text-lg font-medium text-gray-700">{user.username}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found</p>
      )}
    </div>
  );
};

export default SearchResults;


