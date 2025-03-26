{/*import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { House, UserPen } from "lucide-react";

const routeTitles = {
  "/profile": <UserPen />,
  "/landing": "Live Feed",
  "/user": "User",
  "/profile/:userId": "User Profile",
  "/user/:userId/posts": "User Posts",
};

const BreadCrumbsNew = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/landing"); // Navigate to user's landing page
  };

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-gray-500 w-full flex flex-row bg-white-900  py-2">
      <ol className="flex flex-row gap-2">
       
        <li className="flex items-center">
          <button onClick={handleHomeClick} className="text-blue-800 hover:underline flex items-center">
            <House className="w-6 h-6 mr-1" /> 
          </button>
        </li>
        

       
        {pathnames.map((value, index) => {           // Convert numbers to :userId

          let accumulatedPath = `/${pathnames.slice(0, index + 1).join("/")}`; 
              let dynamicPath = accumulatedPath.replace(/\/\d+$/, "/:userId"); 
          const title = routeTitles[dynamicPath] || routeTitles[accumulatedPath] || value;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={accumulatedPath} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>

              {!isLast ? (
                <span to={accumulatedPath} className="text-blue-800 hover:underline capitalize">
                  {title}
                </span>
              ) : (
                <span className="capitalize">{title}</span> // Non-clickable if last breadcrumb
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbsNew;*/}

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { House, UserPen } from "lucide-react";
import { useSelector } from "react-redux";
import { userSlice } from "../features/user/userSlice";

const routeTitles = {
  "/profile": <UserPen />,
  "/landing": "Live Feed",
  "/user": "User",
  "/profile/:userId": "User Profile",
  "/user/:userId/posts": "User Posts",
};

const BreadCrumbsNew = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.user.user);

  const handleHomeClick = () => {
    if (loggedUser) {
      navigate("/landing"); 
      console.error("Logged user data is missing. Please check Redux state.");
    }
  };
  
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-gray-500 w-full flex flex-row bg-white-900 py-2">
      <ol className="flex flex-row gap-2">
        {/* Home Breadcrumb */}
        <li className="flex items-center">
          <button
            onClick={handleHomeClick}
            className="text-blue-800 hover:underline flex items-center"
          >
            <House className="w-6 h-6 mr-1" />
          </button>
        </li>

        {/* Other Breadcrumb Items */}
        {pathnames.map((value, index) => {
          let accumulatedPath = `/${pathnames.slice(0, index + 1).join("/")}`;
          let dynamicPath = accumulatedPath.replace(/\/\d+$/, "/:userId");
          const title = routeTitles[dynamicPath] || routeTitles[accumulatedPath] || value;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={accumulatedPath} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>

              {!isLast ? (
                <span to={accumulatedPath} className="text-blue-800 hover:underline capitalize">
                  {title}
                </span>
              ) : (
                <span className="capitalize">{title}</span> // Non-clickable if last breadcrumb
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbsNew;

