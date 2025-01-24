export const UserOverlay = ({ user, posts }) => {
    return (
      <div className="absolute bg-white shadow-lg p-4 rounded-lg w-72 z-50">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-2">Posts:</h4>
          <ul className="space-y-1">
            {posts.map((post) => (
              <li key={post._id} className="text-sm text-gray-700 truncate">
                {post.content || "Media Post"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  