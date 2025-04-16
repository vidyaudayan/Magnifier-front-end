
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SharedPostRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const postId = queryParams.get('postId');

    if (localStorage.getItem('token')) {
      // User is already logged in, redirect directly to the post
      navigate(`/displaypost?postId=${postId}`, { replace: true });
    } else {
      // User needs to login first, redirect to login with postId
      navigate(`/login?postId=${postId}`, { replace: true });
    }
  }, [location.search, navigate]);

  return <div>Redirecting...</div>;
};

export default SharedPostRedirect;