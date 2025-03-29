import React, { useState, useEffect } from "react";
import logo from '../assets/Images/logo1.jpg';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import BreadCrumbs from "./Breadcrumbs";
import BreadCrumbsNew from "./BreadcrumbsNew";
import { setSearchQuery } from "../features/search/searchSlice";

const NavbarLanding = ({ onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.search.query);
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState();

  // Search functionality
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/search?query=${searchQuery}`
        );
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const debounceFetch = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  // Sync URL query with Redux state
  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("query");
    if (queryParam !== null) {
      dispatch(setSearchQuery(queryParam));
    }
  }, [location, dispatch]);

  const handleUserClick = async (userId, user) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/posts/${userId}`
      );
      navigate(`/user/${userId}/posts`);
      setSelectedUser(user);
      dispatch(setSearchQuery(user.username));
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
    setSelectedUser(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false); // Close mobile menu after search
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

  // Responsive Search Component
  const SearchBar = ({ isMobile = false }) => (
    <form 
      onSubmit={handleSearchSubmit}
      className={`flex ${isMobile ? 'w-full mb-4' : 'flex-grow max-w-2xl mx-4'}`}
    >
      <div className="relative  lg:w-56">
        <input
          type="text"
          placeholder="Search for users..."
          className="w-full bg-white border text-black border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery || ''}
          onChange={handleInputChange} autoFocus
        />
        
      </div>
      <button
        type="submit"
        className={`ml-2 bg-cyan-500 text-white rounded-full px-4 hover:bg-white hover:text-blue-600 transition ${
          isMobile ? 'py-2' : 'py-1'
        }`}
      >
        Search
      </button>
    </form>
  );

  return (
    <header className="z-50 fixed top-0 w-full bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
          />
          <span className="text-2xl md:text-3xl font-bold font-mono">Magnifier</span>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <button
              onClick={handleLogout}
              className="bg-white px-4 py-2 rounded-md text-blue-600 hover:scale-105 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>

        </div>
        

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
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

      {/* Breadcrumbs */}
      <div className="bg-slate-100 p-1 pl-3 lg:pl-10">
        <BreadCrumbsNew />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 pt-4 pb-6">
          <SearchBar isMobile />
          
          {user && (
            <button
              onClick={handleLogout}
              className="w-full bg-white px-4 py-2 rounded-md text-blue-600 hover:scale-105 transition duration-300 mt-4"
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