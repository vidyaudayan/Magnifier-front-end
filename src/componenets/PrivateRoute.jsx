import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Check token existence
    return token ? children : <Navigate to="/signup/delhi" replace/>;
};

export default PrivateRoute;
