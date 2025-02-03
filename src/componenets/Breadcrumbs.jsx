import React from 'react'
import { useLocation, Link } from 'react-router'

const BreadCrumbs = () => {

    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <>
            <nav className="text-sm text-gray-500 w-full bg-white-900">
                <ol className="flex space-x-1">
                    <li>
                        <Link to="/" className="text-blue-800 hover:underline">
                            Home
                        </Link>
                    
                    </li>
                    {pathnames.map((value, index) => {
                        
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        
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
    )
}

export default BreadCrumbs
