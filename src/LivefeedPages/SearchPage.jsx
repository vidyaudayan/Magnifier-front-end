

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../features/search/searchSlice';
import PostCard from '../componenets/Livefeed/PostCard';
import {
  Search as SearchIcon, ThumbsUp,
  ThumbsDown,
  MessageSquare, Users, FileText, Hash, Newspaper, Clock, TrendingUp, ArrowLeft
} from 'lucide-react';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from "../utils/searchHistory"

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [recentSearches, setRecentSearches] = useState(getRecentSearches())
  const searchQuery = useSelector((state) => state.search.query);
  const [results, setResults] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { posts } = useSelector((state) => state.user);
  const user = useSelector(state => state.user.user);

  // Get query from URL and update Redux store
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery && urlQuery !== searchQuery) {
      dispatch(setSearchQuery(urlQuery));
    }
    setIsInitialLoad(false);
  }, [searchParams, dispatch]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setActiveFilter('post');
    navigate(`/livefeed/userprofile/${userId}`);
  };

  // Fetch results when searchQuery or activeFilter changes
  {/*useEffect(() => {
    if (!isInitialLoad && searchQuery) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          let endpoint;
          if (activeFilter === 'all') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/post/search/all?query=${searchQuery}`;
          } else if (activeFilter === 'user') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/user/search?query=${searchQuery}`;
          } else if (activeFilter === 'post') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/post/searchpost?query=${searchQuery}`;
          } else {
            endpoint = `${import.meta.env.VITE_BASE_URL}/search?query=${searchQuery}&type=${activeFilter}`;
          }



          const response = await axios.get(endpoint);

          setResults(response.data.data);

        } catch (error) {
          console.error('Error fetching search results:', error);
          console.error('Search error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });

          setResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    }
  }, [searchQuery, isInitialLoad, activeFilter]);*/}

  // In your useEffect that fetches results
  useEffect(() => {
    if (!isInitialLoad && searchQuery) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          let endpoint;
          const params = { query: searchQuery }; // Always include search query
          
          if (activeFilter === 'all') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/post/search/all`;
          } else if (activeFilter === 'user') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/user/search`;
          } else if (activeFilter === 'post') {
            endpoint = `${import.meta.env.VITE_BASE_URL}/post/searchpost`;
            if (selectedUserId) {
              params.userId = selectedUserId; // Add userId to params if available
            }
          }
  
          console.log('Making request to:', endpoint, 'with params:', params);
          const response = await axios.get(endpoint, { params }); // Send params properly
          
          if (activeFilter === 'all') {
            setResults({
              users: response.data.data.users || [],
              posts: response.data.data.posts || []
            });
          } else {
            setResults(response.data.data || []);
          }
  
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults(activeFilter === 'all' ? { users: [], posts: [] } : []);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    }
  }, [searchQuery, isInitialLoad, activeFilter, selectedUserId]);
 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/livefeed/search?query=${encodeURIComponent(searchQuery)}`);
      const updatedSearches = addRecentSearch(searchQuery);
      setRecentSearches(updatedSearches);
    }
  };

  const handleSearch = (term) => {
    dispatch(setSearchQuery(term));
    if (term.trim()) {
      navigate(`/livefeed/search?query=${encodeURIComponent(term)}`);
      const updatedSearches = addRecentSearch(term);
      setRecentSearches(updatedSearches);
    }
  };

  const clearSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const filters = [
    { id: 'all', label: 'All', icon: SearchIcon },
    { id: 'user', label: 'People', icon: Users },
    { id: 'post', label: 'Posts', icon: FileText },

  ];

  const renderUserResult = (user) => (
    <div
      key={user._id}
      onClick={() => handleUserClick(user._id,user.username)} 
  
      className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={user.profilePic || '/userProfile.avif'}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
      />
      <div className="ml-4">
        <h3 className="font-semibold text-gray-900">{user.username}</h3>
        {user.bio && (
          <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
        )}
        {user.followersCount && (
          <p className="text-xs text-gray-400 mt-1">
            {user.followersCount.toLocaleString()} followers
          </p>
        )}
      </div>
    </div>
  );

  {/*const renderPostResult = (post) => (
    <div
      key={post._id}
      onClick={() => navigate(`/post/${post._id}`)}
      className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >

      {post.postType === 'Photo' && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt={post.title || 'Post image'}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )}

      {post.postType === 'VoiceNote' && (
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </div>
      )}


      {post.postType === 'Text' && (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText size={20} className="text-gray-500" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {post.title || (post.postType === 'Photo' ? 'Photo Post' : post.postType === 'VoiceNote' ? 'Voice Note' : 'Text Post')}
          </h3>
          {post.sticky && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pinned</span>
          )}
        </div>

        {post.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
        )}

        {post.content && post.postType === 'Text' && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
        )}

        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.likes > 0 && <span>{post.likes.toLocaleString()} likes</span>}
          {post.comments?.length > 0 && <span>{post.comments.length} comments</span>}
        </div>
      </div>
    </div>
  )*/}

  const renderPostResult = (post) => (
      <div className="space-y-4 pb-20">
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} user={user} />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No posts available. Create one!
                  </div>
                )}
              </div>
  );

  const renderOtherResult = (result) => {
    switch (result.type) {
      case 'post':
        return (
          <div
            key={result._id}
            onClick={() => navigate(`/post/${result._id}`)}
            className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            {result.image && (
              <img
                src={result.image}
                alt={result.title}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{result.title}</h3>
              {result.content && (
                <p className="text-sm text-gray-500 truncate">{result.content}</p>
              )}
              {result.createdAt && (
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                  {result.likesCount && <span>{result.likesCount.toLocaleString()} likes</span>}
                </div>
              )}
            </div>
          </div>
        );
      case 'topic':
        return (
          <div
            key={result._id}
            onClick={() => navigate(`/topic/${result.name}`)}
            className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Hash size={20} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">#{result.name}</h3>
                {result.isTrending && (
                  <TrendingUp size={16} className="text-blue-500" />
                )}
              </div>
              {result.postCount && (
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{result.postCount.toLocaleString()} posts</span>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl px-4 py-3 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for people, posts, topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery || ''}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                autoFocus
              />
            </div>
          </div>
          {searchQuery && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    // When switching to Posts tab, keep the user context if available
                    {/*if (filter.id === 'post' && selectedUserId) {
                      // You might want to update the URL here
                      navigate(`/livefeed/search?query=${encodeURIComponent(searchQuery)}&tab=post&userId=${selectedUserId}`);
                    }*/}
                    if (filter.id !== 'post') {
                      setSelectedUserId(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <filter.icon size={16} />
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : searchQuery ? (
          activeFilter === 'all' ? (
            <>

              {results.users && results.users.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">PEOPLE</h3>
                  <div className="space-y-3">
                    {results.users.map(renderUserResult)}
                  </div>
                </div>
              )}

              {/* Show posts section */}
              {results.posts && results.posts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">POSTS</h3>
                  <div className="space-y-3">
                    {results.posts.map(renderPostResult)}
                  </div>
                </div>
              )}

              {/* Show no results message if both are empty */}
              {(!results.users || results.users.length === 0) &&
                (!results.posts || results.posts.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
            </>
          ) : activeFilter === 'user' && results.length > 0 ? (
            <div className="space-y-4">
              {results.map(renderUserResult)}
            </div>
          ) : activeFilter === 'post' && results.length > 0 ? (
            <div className="space-y-4">
             
              {/*{results.map(renderPostResult)}*/}
              {results.length > 0 ? (
      results.map(renderPostResult)
    ) : (
      <div className="text-center py-8 text-gray-500">
        {selectedUserId 
          ? `No posts found for this user matching "${searchQuery}"`
          : `No posts found matching "${searchQuery}"`
        }
      </div>
    )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No {activeFilter === 'user' ? 'people' : 'posts'} found for "{searchQuery}"
            </div>
          )
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock size={20} className="text-gray-400" />
                Recent Searches
              </h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearSearches}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="flex items-center gap-3 w-full p-3 text-left bg-white rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Clock size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 flex-1 truncate">{term}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter(t => t !== term);
                        localStorage.setItem('recentSearches', JSON.stringify(updated));
                        setRecentSearches(updated);
                      }}
                      className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                      aria-label="Remove search"
                    >
                      ×
                    </button>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent searches</p>
            )}
          </div>
        )}
      </div>
    </div>
  );


};

export default SearchPage;


