import React from 'react'
import success from '../assets/Images/success.gif'
import { useEffect ,useContext} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Context from '../context/context';
const PaymentSuccess = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  console.log("sessionid",sessionId)
  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      console.log("handleCheckoutSuccess called");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/payment/paysuccess`,
          { sessionId },
          { withCredentials: true }
        );

        if (response.status === 200) {
         
          console.log('Cart cleared successfully');
      
        
  
        }
      } catch (error) {
        console.error('Error during checkout success handling:', error);
      }
    };

   if (sessionId) {
    console.log("Calling handleCheckoutSuccess with sessionId:", sessionId);
      handleCheckoutSuccess();
    }
  }, [sessionId]);

  return (
    <div className='w-full bg-green-100  max-w-md mx-auto flex flex-col items-center justify-center  mt-6'>
    <img src={success} alt="" />
    <h3 className='font-bold text-lg p-3'>Payment Successsful</h3>
   <Link to={'/landing'}> <button className='p-2 m-3 rounded-md bg-blue-300 hover:bg-blue-500'>Complete your post</button>
   </Link>
    </div>
  )
}

export default PaymentSuccess