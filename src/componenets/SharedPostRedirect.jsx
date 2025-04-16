import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedPostRedirect = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // User is logged in - redirect directly to displaypost with the postId
      navigate(`/displaypost?postId=${postId}`, { replace: true });
    } else {
      // User needs to login first - redirect to loginshare with the postId
      navigate(`/loginshare?postId=${postId}`, { replace: true });
    }
  }, [postId, navigate]);

  return <div>Redirecting to post...</div>;
};

export default SharedPostRedirect;