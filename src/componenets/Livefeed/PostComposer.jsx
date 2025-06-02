{/*import React, { useState, useRef } from 'react';
import { Image, Video, Link, Globe2, Brain, X } from 'lucide-react';

const PostComposer = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setContent(text);
    }
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && images.length < 4) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    const hashtags = content.match(/#[\w]+/g) || [];
    const mentions = content.match(/@[\w]+/g) || [];

    onSubmit({
      content,
      images,
      hashtags: hashtags.map(tag => tag.slice(1)),
      mentions: mentions.map(mention => mention.slice(1)),
    });

    setContent('');
    setImages([]);
    setIsExpanded(false);
    setShowAiSuggestions(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-4">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80"
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's on your political mind?"
              value={content}
              onChange={handleContentChange}
              onClick={() => setIsExpanded(true)}
              className="w-full min-h-[60px] bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white text-[15px] leading-relaxed resize-none placeholder-gray-500 dark:placeholder-gray-400"
              style={{ height: isExpanded ? '120px' : '60px' }}
            />

            {images.length > 0 && (
              <div className={`grid gap-2 mt-3 ${
                images.length === 1 ? 'grid-cols-1' :
                images.length === 2 ? 'grid-cols-2' :
                'grid-cols-2'
              }`}>
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload preview ${index + 1}`}
                      className="rounded-xl w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isExpanded && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {content.length}/500 characters
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Image className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Link className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAiSuggestions(!showAiSuggestions)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Brain className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Globe2 className="w-4 h-4" />
            <span>Everyone</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() && images.length === 0}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>

      {showAiSuggestions && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700/50 bg-blue-50 dark:bg-blue-900/20">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-2">ElectoAI Suggestions:</p>
            <ul className="space-y-1">
              <li>• Add relevant hashtags like #PolicyReform or #LocalGovernance</li>
              <li>• Consider mentioning key stakeholders using @mentions</li>
              <li>• Include data or statistics to support your point</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComposer;*/}


import React, { useState, useRef,useEffect } from 'react';
import { Image, Mic, X, Globe2 } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateMetrics } from '../../features/user/userSlice';
import { setUserDetails } from '../../features/user/userSlice';



const PostComposer = ({ user }) => {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('0');
  const [isExpanded, setIsExpanded] = useState(false);
    const [postContent, setPostContent] = useState("");
  const [stickyDuration, setStickyDuration] = useState("3600000");
  const [profilePic, setProfilePic] = useState("");
  const [metrics, setMetrics] = useState(null);
    const photoInputRef = useRef(null);
  const voiceNoteInputRef = useRef(null);
  const navigate = useNavigate();
 const dispatch= useDispatch()
 const disabled = false;
  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setContent(text);
    }
  };

  const handlePhotoUpload = (e) => {
    if (voiceNote) {
      toast.warning("You cannot upload both an image and a voice note.");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleVoiceNoteUpload = (e) => {
    if (photo) {
      toast.warning("You cannot upload both an image and a voice note.");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setVoiceNote(file);
    }
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const removeVoiceNote = () => {
    setVoiceNote(null);
  };

  const handleOkClick = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('content', content);
      formData.append('state', user.state); 
      formData.append('vidhanSabha', user.vidhanSabha);
      formData.append('status', 'draft');
      formData.append('stickyDuration', selectedDuration);
      if (photo) formData.append('media', photo);
      if (voiceNote) formData.append('voiceNote', voiceNote);
      
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      formData.append("timezone", userTimezone);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/createdraftpost`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const postId = response.data.post._id;
      if (!postId) {
        toast.error("Failed to get draft ID from server");
        return;
      }
      
      localStorage.setItem("pendingPost", JSON.stringify({
        draftId: postId,
        stickyDuration: selectedDuration
      }));

      navigate("/livefeed/pricing");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save post draft");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const tempPostId = Math.random().toString(36);
    setLoading(true);
    
    try {
      const formData = new FormData();
      const fileType = photo ? "photo" : (voiceNote ? "audio" : "text");
      formData.append('postType', fileType === 'audio' ? "VoiceNote" : (photo ? "Photo" : "Text"));
      formData.append('content', content || '');
      if (photo) formData.append("media", photo);
      if (voiceNote) formData.append("media", voiceNote);
      formData.append("stickyDuration", selectedDuration);
      
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      formData.append("timezone", userTimezone);
      
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/create`,
        formData,
        { headers },
        { withCredentials: true }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Post created. Admin will review it before publishing.");
      
      // Reset form
      setContent('');
      setPhoto(null);
      setPhotoPreview(null);
      setVoiceNote(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleDurationClick = (durationText) => {
    setSelectedDuration(durationText);
    if (durationText !== '0') {
      setShowPopup(true);
    }
  };

  useEffect(() => {
  
          const fetchMetrics = async () => {
              try {
                  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/usermatrics`, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                  }, { withCredentials: true });
                  setMetrics(response.data);
                  const { userName, profilePicture, walletAmount, totalLikes, totalDislikes, postCount } = response.data;
  
                  // Dispatch fetched metrics to Redux store
                  dispatch(
                      updateMetrics({
                          walletAmount,
                          totalLikes, totalDislikes,
                          postCount, userName, profilePicture,
                      })
                  )
                  const updatedProfilePic = `${response.data.user?.profilePic}?t=${Date.now()}`;
                  setProfilePic(updatedProfilePic);
                  dispatch(setUserDetails({ ...response.data.user, profilePic: updatedProfilePic }));
  
              } catch (error) {
                  console.error("Error fetching metrics", error);
              }
          };
          //dispatch(fetchMetrics());
          fetchMetrics();
      }, []);

   useEffect(() => {
          const savedPost = JSON.parse(localStorage.getItem("pendingPost"));
          if (savedPost) {
              setPostContent(savedPost.content || "");
              setPhotoPreview(savedPost.media || null);
              setVoiceNote(savedPost.voiceNote || null);
              setStickyDuration(savedPost.stickyDuration || ""); // Now it includes the selected duration
          }
      }, []);
  

  return (
    <div className="bg-white dark:bg-slate-800 dark:text-white rounded-2xl shadow-sm border border-gray-200/50 mb-4">
    <div className="p-4">
      <div className="flex items-start space-x-3">
        {metrics?.profilePicture ? (
          <img
            src={metrics.profilePicture}
            alt="User"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">U</span>
          </div>
        )}
        
        <div className="flex-1">
          {metrics?.userName && (
            <p className="text-lg font-semibold mb-2">{metrics.userName}</p>
          )}
          
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
            onClick={() => setIsExpanded(true)}
            className="w-full p-2 min-h-[60px] bg-transparent border-0 focus:ring-0 text-gray-900 text-[15px] leading-relaxed resize-none placeholder-gray-500 dark:text-white"
            style={{ height: isExpanded ? '120px' : '60px' }}
          />

          {/* Media upload buttons - now placed directly below textarea */}
          <div className="flex items-center space-x-2 mt-3">
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"  disabled={!!voiceNote}
              className="hidden"
            />
            <button
              onClick={() => photoInputRef.current?.click()}  disabled={!!voiceNote}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
           <Image
  className={`w-5 h-5   ${disabled ? "opacity-50 grayscale pointer-events-none cursor-not-allowed" : ""}`}
/>
            </button>
            
            <input
              type="file"
              ref={voiceNoteInputRef}
              onChange={handleVoiceNoteUpload}
              accept="audio/*" disabled={!!photo}
              className="hidden"
            />
            <button
              onClick={() => voiceNoteInputRef.current?.click()}  disabled={!!photo}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
   <Mic
  className={`w-5 h-5 ${disabled ? "opacity-50 grayscale pointer-events-none cursor-not-allowed" : ""}`}
/>

            </button>
          </div>

          {photoPreview && (
            <div className="relative group mt-3">
              <img
                src={photoPreview}
                alt="Selected"
                className="rounded-xl w-full max-h-64 object-contain border border-gray-300"
              />
              <button
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {voiceNote && (
            <div className="mt-3 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">{voiceNote.name}</span>
              </div>
              <button
                onClick={removeVoiceNote}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Duration and Post button row - now at the bottom */}
      {isExpanded && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1 max-w-[200px]">
            <label className="block text-sm ml-12 font-medium text-gray-700 mb-1 dark:text-white">
              Display  post on top for
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => handleDurationClick(e.target.value)}
              className="w-full p-2 ml-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm dark:bg-slate-600"
            >
              <option value="0">Please select time duration</option>
              <option value="3600000">1 Hour</option>
              <option value="10800000">3 Hours</option>
              <option value="21600000">6 Hours</option>
              <option value="43200000">12 Hours</option>
            </select>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && !photo && !voiceNote) || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </div>

    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white w-72 p-5 rounded-lg shadow-lg">
          <p className="mb-4 text-sm">
            Hi {user?.username}, Pin Posts are a premium service on the Web Magnifier platform. To view pricing and available time slots, please click on Ok
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default PostComposer;
