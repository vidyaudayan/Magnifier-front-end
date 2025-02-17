import { useLocation, Link } from 'react-router'
import { House ,UserPen} from 'lucide-react';
 const routeTitles = {
    '/': <House />,
    '/profile': <UserPen />,
    '/landing': 'Live Feed',
    '/user': 'user',
    '/profile/:userId': 'User Profile',
    '/user/:userId/posts': 'Live Feed',
  };
  
  const BreadCrumbs = () => {
  
    
   
      const location = useLocation();
      const pathnames = location.pathname.split('/').filter((x) => x);
    
      const generateBreadcrumbs = () => {
        const breadcrumbs = [];
        let accumulatedPath = '';
    
        pathnames.forEach((segment, index) => {
            accumulatedPath += `/${segment}`;  

          const isLast = index === pathnames.length - 1;
    
          // Check for dynamic segments
          const dynamicPath = accumulatedPath.replace(/\/\d+$/, '/:userId');
          const title = routeTitles[dynamicPath] || routeTitles[accumulatedPath] || segment;
    
          if (!isLast) {
            breadcrumbs.push(
              <li key={accumulatedPath} className="flex items-center">
                <Link to={accumulatedPath} className="text-blue-800 hover:underline capitalize">
                  {title}
                </Link>
                <span className="mx-2">/</span>
              </li>
            );
          } else {
            breadcrumbs.push(
              <li key={accumulatedPath} className="flex items-center capitalize">
                {title}
              </li>
            );
          }
        });
    
        return breadcrumbs;
      };
    
      return (
        <nav className="text-sm text-gray-500 w-full flex flex-row bg-white-900">
        <ol className=" flex flex-row justify-between  gap-2">
          <div className='flex flex-row justify-between gap-2'>
            <li className='flex flex-row '>
              <Link to="/" className="text-blue-800  hover:underline">
                <House />
              </Link>
            </li>
          </div>
  
          <li className='flex flex-row'>
            <Link to="/landing" className="text-blue-800 hover:underline">
              Live Feed
            </Link>
          </li>
          <span className="mx-2">/</span>
          {generateBreadcrumbs()}
        </ol>
      </nav>
      );
    };
    
   
    
  
export default BreadCrumbs