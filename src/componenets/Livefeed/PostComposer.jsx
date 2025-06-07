import React, { useState, useRef, useEffect } from 'react';
import { Image, Mic, X, Globe2, Brain, Pin } from 'lucide-react'; // Added Pin icon
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateMetrics } from '../../features/user/userSlice';
import { setUserDetails } from '../../features/user/userSlice';
import { useSelector } from 'react-redux';

const PostComposer = ({ }) => {
  // State variables
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('0');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [stickyDuration, setStickyDuration] = useState("3600000");
  const [profilePic, setProfilePic] = useState("");
  const [metrics, setMetrics] = useState(null);
  
  // Refs
  const photoInputRef = useRef(null);
  const voiceNoteInputRef = useRef(null);
  
  // Redux and hooks
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const disabled = false;

  // Helper function for duration labels
  const getDurationLabel = (duration) => {
    switch (duration) {
      case '3600000': return '1 Hour';
      case '10800000': return '3 Hours';
      case '21600000': return '6 Hours';
      case '43200000': return '12 Hours';
      default: return 'Pin your post';
    }
  };

  // Content change handler
  const handleContentChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setContent(text);
    }
  };

  // Photo upload handler
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

  // Voice note upload handler
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

  // Remove photo
  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Remove voice note
  const removeVoiceNote = () => {
    setVoiceNote(null);
  };

  // Handle draft creation for pinned posts
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

  // Handle regular post submission
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
      setShowAiSuggestions(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/usermatrics`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          const { user, posts, reactions } = response.data.data;
          setMetrics({
            userName: user.username,
            profilePicture: user.profilePic,
            walletAmount: user.walletAmount,
            totalLikes: reactions.likesGiven,
            totalDislikes: reactions.dislikesGiven,
            postCount: posts.count,
            totalLikesReceived: posts.likesReceived,
            totalDislikesReceived: posts.dislikesReceived,
            totalImpressions: posts.impressions
          });

          dispatch(updateMetrics({
            walletAmount: user.walletAmount,
            totalLikes: reactions.likesGiven,
            totalDislikes: reactions.dislikesGiven,
            postCount: posts.count,
            userName: user.username,
            profilePicture: user.profilePic
          }));

          const updatedProfilePic = `${user.profilePic}?t=${Date.now()}`;
          setProfilePic(updatedProfilePic);
          dispatch(setUserDetails({ 
            ...response.data.data.user, 
            profilePic: updatedProfilePic 
          }));
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [dispatch]);

  // Load pending post
  useEffect(() => {
    const savedPost = JSON.parse(localStorage.getItem("pendingPost"));
    if (savedPost) {
      setContent(savedPost.content || "");
      setPhotoPreview(savedPost.media || null);
      setVoiceNote(savedPost.voiceNote || null);
      setStickyDuration(savedPost.stickyDuration || "");
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-4">
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
            {/* Username display */}
            {metrics?.userName && (
              <p className="font-semibold mb-1 text-gray-900 dark:text-white">
                {metrics.userName}
              </p>
            )}
            
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              onClick={() => setIsExpanded(true)}
              className="w-full min-h-[60px] bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white text-[15px] leading-relaxed resize-none placeholder-gray-500 dark:placeholder-gray-400"
              style={{ height: isExpanded ? '120px' : '60px' }}
            />

            {photoPreview && (
              <div className="relative group mt-3">
                <img
                  src={photoPreview}
                  alt="Selected"
                  className="rounded-xl w-full max-h-64 object-contain border border-gray-300 dark:border-gray-600"
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
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{voiceNote.name}</span>
                </div>
                <button
                  onClick={removeVoiceNote}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
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
          {/* Pin button moved to left side */}
          <button
            onClick={() => setShowPopup(true)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedDuration !== '0'
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            title={getDurationLabel(selectedDuration)}
          >
            <Pin className="w-5 h-5" />
          </button>
          
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            disabled={!!voiceNote}
            className="hidden"
          />
          <button
            onClick={() => photoInputRef.current?.click()}
            disabled={!!voiceNote}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Image className={`w-5 h-5 ${disabled ? "opacity-50 grayscale pointer-events-none cursor-not-allowed" : ""}`} />
          </button>
          
          <input
            type="file"
            ref={voiceNoteInputRef}
            onChange={handleVoiceNoteUpload}
            accept="audio/*"
            disabled={!!photo}
            className="hidden"
          />
          <button
            onClick={() => voiceNoteInputRef.current?.click()}
            disabled={!!photo}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Mic className={`w-5 h-5 ${disabled ? "opacity-50 grayscale pointer-events-none cursor-not-allowed" : ""}`} />
          </button>
          
          <button
            onClick={() => setShowAiSuggestions(!showAiSuggestions)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Brain className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && !photo && !voiceNote) || loading}
          className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post"}
        </button>
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

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 w-72 p-5 rounded-lg shadow-lg">
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
              Hi {user?.username}, Pin Posts are a premium service on the Web Magnifier platform. 
              To view pricing and available time slots, please click on Ok
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
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