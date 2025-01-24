import { useState, useEffect } from "react";
import axios from "axios";

const UserSearch = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users based on search query
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/search?query=${searchQuery}`);
        setSearchResults(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300); // Debounce API calls
    return () => clearTimeout(debounceFetch); // Cleanup timeout
  }, [searchQuery]);

  const handleUserClick = (user) => {
    setSelectedUser(user); // Save selected user
    setSearchQuery(user.username); // Update search box with username
    setSearchResults([]); // Clear search results
    if (onUserSelect) {
      onUserSelect(user); // Call the parent function to filter posts
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedUser(null); // Clear selected user if query changes
    if (onUserSelect) {
      onUserSelect(null); // Reset posts if query changes
    }
  };

  return (
    <div className="relative ml-12 w-[600px] lg:w-[625px]">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search users..."
        className="border p-2 pl-4 w-full rounded-full"
      />

      {/* Search Results */}
      {!selectedUser && searchResults.length > 0 && (
        <div className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-3"
              />
              <p>{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
