import React from 'react';
    import { useLocation, Link } from 'react-router-dom';
    import { House, UserPen } from 'lucide-react';
    
    const routeTitles = {
      
      '/profile': <UserPen />,
      '/landing': 'Live Feed',
      
      //'/profile/:userId': 'User Profile',
      '/user/:userId/posts': 'User Posts',
    };
    
    const BreadCrumbs = () => {
      const location = useLocation();
      const pathnames = location.pathname.split('/').filter(x => x);
    
      return (
        <nav className="text-sm text-gray-500 w-full flex flex-row bg-white-900">
          <ol className="flex flex-row justify-between gap-2">
            {/* Home Breadcrumb */}
            <li className="flex flex-row">
              <Link to={"/landing"} className="text-blue-800 hover:underline">
                <House />
              </Link>
            </li>
    
           
            {pathnames.map((value, index) => {
              let accumulatedPath = `/${pathnames.slice(0, index + 1).join("/")}`; 
              let dynamicPath = accumulatedPath.replace(/\/\d+$/, "/:userId"); 
    
              const title = routeTitles[dynamicPath] || routeTitles[accumulatedPath] || value;
              const isLast = index === pathnames.length - 1;
    
              // Ensure user/:userId is only clickable if it's a valid route
              const isUserIdPath = accumulatedPath.match(/^\/user\/\d+$/);
    
              return (
                <li key={accumulatedPath} className="flex items-center">
                  <span className="mx-2">/</span>
    
                  {!isLast && (!isUserIdPath || routeTitles["/user/:userId"]) ? (
                    <span to={accumulatedPath} className="text-blue-800 hover:underline capitalize">
                      {title}
                    </span>
                  ) : (
                    <span className="capitalize">{title}</span> // Non-clickable if invalid
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      );
    };
    
    export default BreadCrumbs;
