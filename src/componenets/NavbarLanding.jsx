
import React, { useState, useEffect } from "react";
import logo from '../assets/Images/logo1.jpg';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumbs from "./Breadcrumbs";
import BreadCrumbsNew from "./BreadcrumbsNew";
const NavbarLanding = ({ onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
const[posts,setPosts]= useState()
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
        console.error('Error fetching users:', error);
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300); // Debounce API calls
    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  const handleUserClick = async (userId, user) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`);
      const userPosts = response.data.data;
console.log("searchuser",response)
      // Example post update logic
      {/*setPosts((prevPosts) => [
        ...prevPosts.filter((post) => post.userId !== userId),
        ...userPosts,
      ]);*/}
      navigate(`/user/${userId}/posts`);
      setSelectedUser(user);
      setSearchQuery(user.username);
      setSearchResults([]);
      //onUserSelect(user);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedUser(null);
  
    if (value.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(value)}`);
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      dispatch(clearUserDetails());
      toast.success("You are logged out.");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <header className="z-50 fixed top-0 w-full bg-blue-600 text-white shadow-lg lg:h-24">
     
    <nav className="container mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
        />
        <span className="text-2xl md:text-3xl font-bold font-mono">Magnifier</span>
      </div>

      <div className=" hidden md:flex items-center space-x-6 lg:space-x-12 ">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for users..."
          className="bg-white border text-black border-gray-300 rounded-full p-2 lg:w-[630px]relative w-full  mx-auto mt-1"
          value={searchQuery}
          onChange={handleInputChange}
        />

        {/* Search Results */}
        {!selectedUser && searchResults.length > 0 && (
          <div className="absolute bg-slate-200 shadow-md rounded-md mt-60 w-full z-10">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserClick(user._id, user)}
              >
                <img
                  src={user.profilePic || 'default-profile-pic.jpg'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p className="text-sm text-black font-medium">{user.username}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="ml-4 bg-white px-4 py-2 rounded-md text-blue-600 hover:scale-105 transition duration-300"
          >
            Logout
          </button>
        )}
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      
    </nav>
    <div className="bg-slate-100 p-1 pl-3 lg:pl-10">
      <BreadCrumbsNew/>
    </div>

    {isOpen && (
      <div className="md:hidden bg-blue-700 px-4 pt-4 pb-6">

      <input
        type="text"
        placeholder="Search for users..."
        className="bg-white border text-black border-gray-300 rounded-full p-2 w-full mb-4"
        value={searchQuery}
        onChange={handleInputChange}
      />
     
      {!selectedUser && searchResults.length > 0 && (
        <div className="bg-slate-200 shadow-md rounded-md w-full z-10">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUserClick(user._id, user)}
            >
              <img
                src={user.profilePic || 'default-profile-pic.jpg'}
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="text-sm text-black font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      )}
      {user && (
        <button
          onClick={handleLogout}
          className="w-full bg-white px-4 py-2 rounded-md text-blue-600 hover:scale-105 transition duration-300"
        >
          Logout
        </button>
      )}
    </div>
  )}
</header>
  );
};

export default NavbarLanding;


