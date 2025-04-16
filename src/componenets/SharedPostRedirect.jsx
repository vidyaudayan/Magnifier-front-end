import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SharedPostRedirect = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) {
      navigate("/posts");
      return;
    }

    if (localStorage.getItem("token")) {
      // Already logged in - go directly to the post
      navigate(`/displaypost?postId=${postId}`, { replace: true });
    } else {
      // Need to login first - store postId and redirect to login
      localStorage.setItem("sharedPostId", postId);
      sessionStorage.setItem("sharedPostId", postId);
      navigate("/loginshare", { replace: true });
    }
  }, [postId, navigate]);

  return <div>Redirecting...</div>;
};

export default SharedPostRedirect;