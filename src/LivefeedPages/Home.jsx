import React, { useState,useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import FeedHeader from '../componenets/Livefeed/FeedHeader';
import ContextBanner from '../componenets/Livefeed/ContextBanner';
import PostCard from '../componenets/Livefeed/PostCard';
import PostComposer from '../componenets/Livefeed/PostComposer';
import TrendingSection from '../componenets/Livefeed/TrendingSection';
import { setPosts } from '../features/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('personalized');
  const { posts, walletAmount, totalLikes, totalDislikes, postCount, } = useSelector(
         (state) => state.user
     )
     const [loading, setLoading] = useState(true);
     const  user  = useSelector((state) => state.user);
     useEffect(() => {
      const fetchPosts = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/post`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          console.log('Fetched posts:', response.data.posts);

          dispatch(setPosts(response.data.posts));
        } catch (error) {
          console.error('Error fetching posts:', error);
          toast.error('Failed to load posts');
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, [dispatch]);
  
    const handlePostSubmit = async (newPost) => {
      try {
        const formData = new FormData();
        formData.append('content', newPost.content);
        if (newPost.images) {
          newPost.images.forEach(image => {
            formData.append('media', image);
          });
        }
  
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/post/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        // Add the new post to the beginning of the posts array
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success('Post created successfully!');
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post');
      }
    };
  
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading posts...</div>;
    }

  return (
   
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <div className="space-y-4 mt-6">
              {/* Context Banners */}
              <ContextBanner
                type="election"
                message="Election Day in Maharashtra - 23 days to go"
                link="/elections/maharashtra"
              />
              <ContextBanner
                type="live"
                message="Budget Speech Live Now - Watch the Finance Minister's address"
                link="/live/budget-2024"
              />

              {/* Feed Header with Tabs */}
               <div className='sticky top-0 bg-slate-50 text-slate-50 z-30'>h</div>
             
              <div className="sticky top-[120px] md:top-4 z-10 -mx-4 px-4 pb-4  pt-2 bg-gray-50 dark:bg-gray-900">
                <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              
              {/* Post Composer */}
              <PostComposer onSubmit={handlePostSubmit} />

              {/* Posts Feed */}
              <div className="space-y-4 pb-20">
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} user={user} // make sure to pass the current user
                />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No posts available. Create one!
                  </div>
                )}
              </div>
            </div>


            {/* Create Post Button */}
            {/*<button className="fixed bottom-20 right-6 md:bottom-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors md:z-10 z-50">
            <PlusCircle className="w-6 h-6" />
            </button>*/}
          </div>

          {/* Trending Section - Desktop Only */}
          <div className="hidden md:block w-80">
            <div className="sticky top-4">
              <TrendingSection />
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default Home;
