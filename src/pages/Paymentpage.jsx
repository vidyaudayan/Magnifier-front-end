import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get slot details from previous page
  const { duration, startHour, endHour, amount,stickyStartUTC,
    stickyEndUTC } = location.state || {};

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [pendingPost, setPendingPost] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  // Handle input changes
  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Get pending post from localStorage
    const postData = localStorage.getItem("pendingPost");
    if (postData) {
      setPendingPost(JSON.parse(postData));
    }
  }, []);

  // Handle payment submission
  {/*const handlePayment = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
      // 1. First create payment intent on your backend
      const paymentIntentResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-payment-intent`,
        {
          amount: amount * 100, // in paise
          postId: pendingPost?.draftId,
          duration,
          startHour,
          endHour
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { order, paymentId } = paymentIntentResponse.data;
  
      // 2. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verificationResponse = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/user/verifypayment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                postId: pendingPost?.draftId,
                duration,
                startHour,
                endHour,
                amount: amount * 100, // CRITICAL: Pass amount in paise
                paymentId // Pass the paymentId from first step
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
  
            if (verificationResponse.data.success) {
              toast.success("Payment successful! Post pinned.");
              navigate("/success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment processing failed");
          }
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };*/}
  const handlePayment = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
  
    try {
      // 1. First load Razorpay SDK
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }
  
      // 2. Check if Razorpay is available
      if (!window.Razorpay) {
        throw new Error('Payment processor not available');
      }
  
      // 3. Create payment intent
      const intentResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-payment-intent`,
        {
          amount: Math.round(amount * 100),
          postId: pendingPost?.draftId,
          duration,
          startHour,
          endHour,stickyStartUTC,
          stickyEndUTC
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      const { order, paymentId } = intentResponse.data;
  
      // 4. Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Magnifier",
        description: `Pinning post for ${duration} hours`,
        handler: async (response) => {
          await verifyPayment(response, paymentId, amount);
        },
        modal: {
          ondismiss: async function () {
            // User closed Razorpay modal
            toast.warn("Payment was cancelled by user");
            await notifyBackendOnFailure(paymentId, "User cancelled payment");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      // 5. Create Razorpay instance
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        console.log("Payment failed:", response.error);
        toast.error("Payment failed: " + response.error.description);
        await notifyBackendOnFailure(paymentId, response.error.description || "Payment failed");
        navigate("/retry-payment");
      });

      rzp.on("payment.failed", function () {
        setTimeout(() => {
          navigate("/retry-payment");
        }, 3000);
      });
      
      
      rzp.open();
  
    } catch (error) {
      console.error("Payment error details:", {
        message: error.message,
        razorpayAvailable: !!window.Razorpay,
        error
      });
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const notifyBackendOnFailure = async (paymentId, reason) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/payment-failed`,
        {
          postId: pendingPost?.draftId,
          paymentId,
          reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
    } catch (error) {
      console.error("Failed to notify backend:", error);
    }
  };
  
 
  const verifyPayment = async (razorpayResponse, paymentId, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verifypayment`,
        {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          postId: pendingPost.draftId,
          paymentId,
          amount: Math.round(amount * 100),
          duration,
          startHour,
          endHour,stickyStartUTC,
          stickyEndUTC
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        toast.success("Payment verified successfully!");
        navigate("/success");
      } else {
        throw new Error(response.data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Payment verification failed");
      // Consider implementing retry logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Your Payment</h2>

        {/* Display selected slot details */}
        <div className="bg-blue-100 p-4 mt-4 rounded-lg">
          <p className="text-gray-700 font-semibold">
            Duration: <span className="text-blue-600">{duration} Hours</span>
          </p>
          <p className="text-gray-700 font-semibold">
            Time Slot: <span className="text-blue-600">{startHour}:00 - {endHour}:00</span>
          </p>

          <p><strong>Total Amount:</strong> ₹{amount}</p>
        </div>

        {/* Card Details Form */}
        <form className="mt-6 space-y-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            maxLength="16"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            value={cardDetails.cardNumber}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cardHolder"
            placeholder="Cardholder Name"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            value={cardDetails.cardHolder}
            onChange={handleChange}
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              maxLength="5"
              className="w-1/2 p-3 border rounded-lg focus:ring focus:ring-blue-300"
              value={cardDetails.expiryDate}
              onChange={handleChange}
            />
            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              maxLength="3"
              className="w-1/2 p-3 border rounded-lg focus:ring focus:ring-blue-300"
              value={cardDetails.cvv}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Proceed to Pay
          </button>
        </form>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold">Confirm Payment</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to proceed with the payment?</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
