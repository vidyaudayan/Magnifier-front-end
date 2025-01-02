import { Outlet } from "react-router-dom";
import Navbar from "../componenets/Navbar";

import { ToastContainer, toast } from 'react-toastify';
import WelcomeNew from "../componenets/WelcomeNew";
import Header from "../componenets/Header";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { setUserDetails } from "../features/user/userSlice.js";
import Context from "../context/context.jsx";
import { createContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../componenets/Footer.jsx";
export default function Root() {
  const dispatch= useDispatch()

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
          console.log( "job token",token)
    const headers = { Authorization: `Bearer ${token}`}
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userprofile`,{headers}, {withCredentials:true});
      const dataResponse = response.data;
  
      console.log(dataResponse);
     
      const dataApi = response.data;
      dispatch(setUserDetails(dataApi))
     /* if (dataApi.success) {
        dispatch(setUserDetails(dataApi));
      }*/
    } catch (error) {
      
      console.error('Error fetching user details:', error);
    }
  };
  
  useEffect(()=>{

    fetchUserDetails()

  },[])
  
  return (
    <>
     
      <div id="detail">
        
      <Context.Provider value={{
          fetchUserDetails, 
      
      }}>
      
      <ToastContainer 
       position="top-center" // Position for all toasts
       limit={3} // Max number of toasts at a time
       toastClassName={() =>
         "relative bg-white text-gray-800 shadow-lg rounded-lg p-4 max-w-xs"
       }
       bodyClassName={() => "text-sm"}
       closeButton={false} // Optionally remove the close button
      />
       
      
    <main>
    <Outlet />
   
    </main>
    </Context.Provider>,
   
      </div>
   
    </>
  );
}
