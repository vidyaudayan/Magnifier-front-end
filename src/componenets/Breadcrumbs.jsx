import React from "react";
import { useLocation, Link } from "react-router-dom"; // Correct import
import { House, UserPen } from "lucide-react";

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <nav className="text-sm text-gray-500 w-full flex flex-row bg-white-900">
        <ol className="flex flex-row justify-between gap-2">
          <div className="flex flex-row justify-between gap-2">
            <li className="flex flex-row">
              <Link to="/landing" className="text-blue-800 hover:underline">
                <House />
              </Link>
            </li>
          </div>
          <li className="flex flex-row">
            <Link to="/profile" className="text-blue-800 hover:underline">
              <UserPen />
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`; // ✅ Fixed template literal

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2">/</span>
                <Link to={to} className="text-blue-800 hover:underline capitalize">
                  {value}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default BreadCrumbs;
