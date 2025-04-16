
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SharedPostRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const postId = pathname.split('/post/')[1];
    
    if (localStorage.getItem('token')) {
      // Already logged in - go directly to displaypost
      navigate(`/displaypost?postId=${postId}`, { replace: true });
    } else {
      // Need to login first - go to loginshare
      navigate(`/loginshare?postId=${postId}`, { replace: true });
    }
  }, [pathname, navigate]);

  return <div>Redirecting...</div>;
};

export default SharedPostRedirect;