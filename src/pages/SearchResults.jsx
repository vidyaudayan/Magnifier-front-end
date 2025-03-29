import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarLanding from '../componenets/NavbarLanding';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../features/search/searchSlice';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.query);
  const [results, setResults] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get query from URL and update Redux store
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery && urlQuery !== searchQuery) {
      dispatch(setSearchQuery(urlQuery));
    }
    setIsInitialLoad(false);
  }, [searchParams, dispatch]);

  // Debugging log
  useEffect(() => {
    console.log('Current searchQuery:', searchQuery);
  }, [searchQuery]);

  // Fetch results when searchQuery changes
  useEffect(() => {
    if (!isInitialLoad && searchQuery) {
      const fetchResults = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/user/search?query=${searchQuery}`
          );
          setResults(response.data.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchResults();
    }
  }, [searchQuery, isInitialLoad]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarLanding/>
      <div className="pt-32 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'}
        </h2>

        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search users..."
              className="border p-2 pl-4 w-1/2 rounded-l-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 rounded-r-full"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results display */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/user/${user._id}/posts`)}
                className="flex items-center p-4 bg-white shadow-lg rounded-xl cursor-pointer hover:bg-violet-200 transition duration-300"
              >
                <img
                  src={user.profilePic || '/default-avatar.png'}
                  alt={user.username}
                  className="w-14 h-14 rounded-full object-fill border-2 border-gray-300"
                />
                <p className="ml-4 text-lg font-medium text-gray-700">
                  {user.username}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {searchQuery ? "No results found" : "Enter a search term"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;