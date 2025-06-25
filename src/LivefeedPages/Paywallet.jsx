import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { DateTime } from "luxon";
import { loadRazorpayScript } from "../utils/razorpayUtils.js";
import {
  Clock,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  ChevronRight,
  Wallet as WalletIcon
} from "lucide-react";
import NavbarLanding from "../componenets/NavbarLanding.jsx";

const socket = io("http://localhost:3000");

export default function Paywallet() {
  const [selectedDuration, setSelectedDuration] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
 const [selectedDate, setSelectedDate] = useState(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const [stickyDurations, setStickyDurations] = useState({});
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
 
useEffect(() => {
  console.log("Selected date changed:", selectedDate);
  if (selectedDuration) {
    console.log("Fetching slots for duration:", selectedDuration);
    fetchAvailableSlots(selectedDuration);
  }
}, [selectedDate, selectedDuration]);

// In your fetch function:
console.log("Request params:", {
  date: selectedDate.toISOString().split('T')[0],
  duration: selectedDuration
});

useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/balance`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setWalletBalance(response.data.totalPoints);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    socket.on("slotBooked", ({ startHour, endHour }) => {
      console.log(`Slot booked from ${startHour} to ${endHour}`);
      const duration = stickyDurations[selectedPostId] || 0;
      fetchAvailableSlots(duration);
    });

    return () => {
      socket.off("slotBooked");
    };
  }, []);

  useEffect(() => {
    socket.on("slotBooked", (bookedSlot) => {
      setAvailableSlots(prevSlots => 
        prevSlots.filter(s => 
          !(s.startHour === bookedSlot.startHour && 
            s.endHour === bookedSlot.endHour)
        )
      );
    });
  
    return () => {
      socket.off("slotBooked");
    };
  }, []);

  useEffect(() => {
    const handleSlotUpdate = () => {
      if (selectedDuration) {
        fetchAvailableSlots(selectedDuration);
      }
    };

    socket.on("slotBooked", handleSlotUpdate);
    socket.on("slotsReleased", handleSlotUpdate);

    return () => {
      socket.off("slotBooked", handleSlotUpdate);
      socket.off("slotsReleased", handleSlotUpdate);
    };
  }, [selectedDuration]);

 // In your fetchAvailableSlots function, ensure proper date formatting:
// New utility function
const formatDateForBackend = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

// Updated fetch function
const fetchAvailableSlots = async (duration) => {
  try {
    // Format date as YYYY-MM-DD string
    //const dateStr = selectedDate.toISOString().split('T')[0];
      const utcDateStr = new Date(selectedDate).toISOString().split('T')[0];
    console.log("Fetching slots for:", { date: dateStr, duration }); // Debug log
    
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/available-slots`,
      {
        params: { 
         date: utcDateStr,
          duration,
          _: Date.now() // Cache buster
        }
      }
    );
    
    console.log("Received slots data:", response.data); // Debug log
    
    // Transform backend data to frontend format
    const formattedSlots = response.data.map(slot => ({
      startHour: slot.startHour,
      endHour: slot.endHour,
      duration: slot.duration,
      booked: slot.booked,
      displayTime: formatSlotTime(slot.startHour, slot.endHour),
    
    isAvailable: !slot.booked && 
              (!slot.expiresAt || new Date(slot.expiresAt) > new Date()) &&
              (!slot.reserved || 
               (slot.reserved && new Date(slot.expiresAt) <= new Date()))
})).sort((a, b) => a.startHour - b.startHour);
    
    console.log("Formatted slots:", formattedSlots); // Debug log
    setAvailableSlots(formattedSlots);
  } catch (error) {
    console.error("Slot fetch error:", error);
    toast.error("Failed to load available slots");
    setAvailableSlots([]);
  }
};

  const formatSlotTime = (start, end) => {
    const startHour = start % 12 || 12;
    const endHour = end % 12 || 12;
    const startAmPm = start < 12 ? 'AM' : 'PM';
    const endAmPm = end < 12 ? 'AM' : 'PM';
    return `${startHour}:00 ${startAmPm} - ${endHour}:00 ${endAmPm}`;
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    fetchAvailableSlots(duration);
    setShowSlotModal(true);
  };

  {/*const handleSlotSelection = async (slot) => {
    try {
 const utcDateStr = new Date(selectedDate).toISOString().split('T')[0]
   const availabilityCheck = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/check-availability`,
      {
        params: {
          //date: selectedDate.toISOString().split('T')[0],
              date: utcDateStr,
          startHour: slot.startHour,
          duration: selectedDuration
        }
      }
    );

    if (!availabilityCheck.data.available) {
      toast.error("This slot was just booked by someone else. Please select another.");
     await fetchAvailableSlots(selectedDuration); // Refresh the slots
      return;
    }

      const token = localStorage.getItem('token');
      const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
      
      if (!pendingPost?.draftId) {
        toast.error("No draft post found");
        return;
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/book-slot`,
        {
          startHour: slot.startHour,
          //endHour: slot.endHour,
          duration: selectedDuration,
          postId: pendingPost.draftId,
          //selectedDate: selectedDate.toISOString().split('T')[0]
        selectedDate: utcDateStr
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  console.log("book response", response)
      if (response.data.success) {
        toast.success("Slot reserved!");
        setConfirmedSlot(slot);
        setShowConfirmationModal(true);
        socket.emit("slotBooked");
     
        const istZone = 'Asia/Kolkata';
        const now = DateTime.now().setZone(istZone);

        let startIST = now.set({ hour: slot.startHour, minute: 0, second: 0, millisecond: 0 });
        let endIST = now.set({ hour: slot.endHour, minute: 0, second: 0, millisecond: 0 });

        if (startIST < now) {
          startIST = startIST.plus({ days: 1 });
          endIST = endIST.plus({ days: 1 });
        }

        const stickyStartUTC = startIST.toUTC().toISO();
        const stickyEndUTC = endIST.toUTC().toISO();

        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/post/updatestickytime`,
          {
            postId: pendingPost.draftId,
            stickyStartUTC, stickyEndUTC
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Booking failed");
    }
  };*/}

  const handleSlotSelection = async (slot) => {
  console.log('--- Starting handleSlotSelection ---');
  console.log('Selected slot:', slot);
  console.log('Selected duration:', selectedDuration);
  console.log('Selected date:', selectedDate);

  try {
    const utcDateStr = new Date(selectedDate).toISOString().split('T')[0];
    console.log('Formatted date for API:', utcDateStr);

    // Verify authentication
    const token = localStorage.getItem('token');
    console.log('Authentication token exists:', !!token);
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    // Verify pending post
    const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
    console.log('Pending post:', pendingPost);
    if (!pendingPost?.draftId) {
      toast.error("No draft post found");
      return;
    }

    // Check availability
    console.log('Checking availability...');
    const availabilityCheck = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/check-availability`,
      {
        params: {
          date: utcDateStr,
          startHour: slot.startHour,
          duration: selectedDuration
        }
      }
    );
    console.log('Availability check result:', availabilityCheck.data);

    if (!availabilityCheck.data.available) {
      toast.error("This slot was just booked by someone else. Please select another.");
      await fetchAvailableSlots(selectedDuration);
      return;
    }

    // Make booking request
    console.log('Making booking request...');
    const bookingPayload = {
      startHour: slot.startHour,
      duration: selectedDuration,
      postId: pendingPost.draftId,
      selectedDate: utcDateStr
    };
    console.log('Booking payload:', bookingPayload);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admin/book-slot`,
      bookingPayload,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Booking response:', response.data);

    if (response.data.success) {
      toast.success("Slot reserved!");
      setConfirmedSlot(slot);
      setShowConfirmationModal(true);
      socket.emit("slotBooked");
      
      // Calculate sticky times
      const istZone = 'Asia/Kolkata';
      const now = DateTime.now().setZone(istZone);
      let startIST = now.set({ hour: slot.startHour, minute: 0, second: 0, millisecond: 0 });
      let endIST = now.set({ hour: slot.endHour, minute: 0, second: 0, millisecond: 0 });

      if (startIST < now) {
        startIST = startIST.plus({ days: 1 });
        endIST = endIST.plus({ days: 1 });
      }

      const stickyStartUTC = startIST.toUTC().toISO();
      const stickyEndUTC = endIST.toUTC().toISO();
      console.log('Sticky times:', { stickyStartUTC, stickyEndUTC });

      // Update post sticky time
      console.log('Updating post sticky time...');
      const updateResponse = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/post/updatestickytime`,
        {
          postId: pendingPost.draftId,
          stickyStartUTC,
          stickyEndUTC
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Post update response:', updateResponse.data);

    } else {
      console.warn('Booking API returned success:false');
      toast.error(response.data.message || "Booking failed");
    }

  } catch (error) {
    console.error('Booking failed:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    let errorMessage = "Booking failed";
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Authentication expired - please login again";
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      }
    }
    
    toast.error(errorMessage);
  } finally {
    console.log('--- handleSlotSelection completed ---');
  }
};

  // In your React component where you display slots
const renderSlots = () => {
  return availableSlots.map((slot, index) => {
    const isBooked = !slot.available;
    const isExpired = slot.isExpired;
    const isActive = slot.isActive;

    // Determine slot style based on status
    let slotStyle = "bg-blue-500 hover:bg-blue-600"; // Default available slot
    let cursorStyle = "cursor-pointer";
    let textStyle = "text-white";
    
    if (isBooked) {
      slotStyle = "bg-gray-400"; // Booked slot
      cursorStyle = "cursor-not-allowed";
    } else if (isExpired) {
      slotStyle = "bg-yellow-400"; // Expired reservation
      textStyle = "text-gray-800";
    } else if (isActive) {
      slotStyle = "bg-green-500"; // Currently active pinned post
    }

    return (
      <button
        key={index}
        className={`px-4 py-2 rounded transition-colors ${slotStyle} ${cursorStyle} ${textStyle}`}
        onClick={() => !isBooked && handleSlotSelection(slot)}
        disabled={isBooked}
      >
        {slot.displayTime}
        {isBooked && <span className="ml-2 text-xs">(Booked)</span>}
        {isActive && <span className="ml-2 text-xs">(Active)</span>}
      </button>
    );
  });
};

  const handleConfirmBooking = async () => {
    try {
      const duration = Number(selectedDuration);
      const pricing = {
        1: 30,
        3: 90,
        6: 180,
        12: 360,
      };
  
      const amount = pricing[duration] || 0;
      
     if (walletBalance >= amount) {
      setShowAuthModal(true);
    } else {
      setShowInsufficientBalanceModal(true);
    }
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  const proceedToRazorpayPayment = async (duration, slot) => {
    try {
      setIsProcessing(true);
      const istZone = 'Asia/Kolkata';
      const now = DateTime.now().setZone(istZone);
      let startIST = now.set({ hour: slot.startHour, minute: 0, second: 0, millisecond: 0 });
      let endIST = now.set({ hour: slot.endHour, minute: 0, second: 0, millisecond: 0 });

      if (startIST < now) {
        startIST = startIST.plus({ days: 1 });
        endIST = endIST.plus({ days: 1 });
      }

      const stickyStartUTC = startIST.toUTC().toISO();
      const stickyEndUTC = endIST.toUTC().toISO();

      const pricing = {
        1: 30,
        3: 90,
        6: 180,
        12: 360,
      };
      const amount = pricing[duration] || 0;
      
      await initiateRazorpayPayment({
        duration,
        startHour: slot.startHour,
        endHour: slot.endHour,
        amount,
        stickyStartUTC,
        stickyEndUTC
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletPayment = async () => {
    try {
      setIsProcessing(true);
      const duration = Number(selectedDuration);
      const pricing = {
        1: 30,
        3: 90,
        6: 180,
        12: 360,
      };
      const amount = pricing[duration] || 0;
      
      const token = localStorage.getItem('token');
      const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
      
      if (!pendingPost?.draftId) {
        toast.error("No draft post found");
        return;
      }

      const istZone = 'Asia/Kolkata';
      const now = DateTime.now().setZone(istZone);
      let startIST = now.set({ hour: confirmedSlot.startHour, minute: 0, second: 0, millisecond: 0 });
      let endIST = now.set({ hour: confirmedSlot.endHour, minute: 0, second: 0, millisecond: 0 });

      if (startIST < now) {
        startIST = startIST.plus({ days: 1 });
        endIST = endIST.plus({ days: 1 });
      }

      const stickyStartUTC = startIST.toUTC().toISO();
      const stickyEndUTC = endIST.toUTC().toISO();

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/pay-from-wallet`,
        {
          postId: pendingPost.draftId,
          amount,
          duration,
          startHour: confirmedSlot.startHour,
          endHour: confirmedSlot.endHour,
          stickyStartUTC,
          stickyEndUTC
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Payment successful! Your post is now pinned.");
        setWalletBalance(walletBalance - amount);
        setShowConfirmationModal(false);
        setShowPaymentOptions(false);
      } else {
        throw new Error(response.data.error || "Payment failed");
      }
    } catch (error) {
      console.error("Wallet payment error:", error);
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  {/*const initiateRazorpayPayment = async (paymentDetails) => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }
  
      const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
      if (!pendingPost?.draftId) {
        throw new Error('No draft post found');
      }
  
      const intentResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-payment-intent`,
        {
          amount: Math.round(paymentDetails.amount * 100),
          postId: pendingPost.draftId,
          duration: paymentDetails.duration,
          startHour: paymentDetails.startHour,
          endHour: paymentDetails.endHour,
          stickyStartUTC: paymentDetails.stickyStartUTC,
          stickyEndUTC: paymentDetails.stickyEndUTC
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      const { order, paymentId } = intentResponse.data;
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Your App Name",
        description: `Pinning post for ${paymentDetails.duration} hours`,
        handler: async (response) => {
          await verifyPayment(response, paymentId, paymentDetails);
        },
        modal: {
          ondismiss: async function() {
            toast.warn("Payment was cancelled by user");
            await notifyBackendOnFailure(paymentId, "User cancelled payment");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const rzp = new window.Razorpay(options);
  
      rzp.on("payment.failed", async function(response) {
        console.log("Payment failed:", response.error);
        toast.error("Payment failed: " + response.error.description);
        await notifyBackendOnFailure(paymentId, response.error.description || "Payment failed");
      });
  
      rzp.open();
  
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const verifyPayment = async (razorpayResponse, paymentId, paymentDetails) => {
    try {
      const token = localStorage.getItem('token');
      const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verifypayment`,
        {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          postId: pendingPost.draftId,
          paymentId,
          amount: Math.round(paymentDetails.amount * 100),
          duration: paymentDetails.duration,
          startHour: paymentDetails.startHour,
          endHour: paymentDetails.endHour,
          stickyStartUTC: paymentDetails.stickyStartUTC,
          stickyEndUTC: paymentDetails.stickyEndUTC
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        toast.success("Payment successful! Your post is now pinned.");
      } else {
        throw new Error(response.data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Payment verification failed");
      navigate("/retry-payment");
    }
  };
  
  const notifyBackendOnFailure = async (paymentId, reason) => {
    const token = localStorage.getItem('token');
    try {
      const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
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
  };*/}

  const pricingPlans = [
    {
      duration: 1,
      label: "1 Hour",
      price: "₹30",
      description: "Short-term visibility boost",
      icon: Clock
    },
    {
      duration: 3,
      label: "3 Hours",
      price: "₹90",
      description: "Extended visibility period",
      icon: Clock
    },
    {
      duration: 6,
      label: "6 Hours",
      price: "₹180",
      description: "Half-day prominence",
      icon: Clock
    },
    {
      duration: 12,
      label: "12 Hours",
      price: "₹360",
      description: "Full-day featured placement",
      icon: Clock
    }
  ];

 return(
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Pin Post Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the perfect duration to boost your post's visibility
          </p>
        </div>
// Add this to your main component return, before the pricing plans section
<div className="mb-6">
  <label className="block mb-2 font-medium">Select Date</label>
 <input
  type="date"
  value={selectedDate.toISOString().split('T')[0]}
  onChange={(e) => {
    const date = new Date(e.target.value);
    // Adjust for timezone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + timezoneOffset);
    setSelectedDate(adjustedDate);
  }}
  min={new Date().toISOString().split('T')[0]}
  className="p-2 border rounded"
/>
</div>
        {/* Pricing Plans Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-12">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Available Plans
              </h2>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {pricingPlans.map((plan) => (
              <div
                key={plan.duration}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => handleDurationChange(plan.duration)}
              >
                <div className="flex items-center space-x-4">
                  <plan.icon className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {plan.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {plan.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-12">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                How Pinned Posts Work
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Choose Duration</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select how long you want your post to stay pinned at the top of the feed.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Pick a Time Slot</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select from available time slots when your audience is most active.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Make Payment</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Complete the secure payment process to activate your pinned post.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Selection Modal */}
    {showSlotModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Available {selectedDuration}-hour Slots for {selectedDate.toDateString()}
      </h3>
      
      {availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No available slots found for this duration.
          </p>
          <button 
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
            onClick={() => fetchAvailableSlots(selectedDuration)}
          >
            Retry Loading Slots
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
          {availableSlots.map((slot, index) => (
            <div key={index} className="flex flex-col">
              <button
                className={`px-4 py-2 rounded transition-colors ${
                  slot.isAvailable
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed text-white'
                }`}
                onClick={() => slot.isAvailable && handleSlotSelection(slot)}
                disabled={!slot.isAvailable}
              >
                {slot.displayTime}
              </button>
              <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {!slot.isAvailable && "(Booked)"}
                {slot.isAvailable && "(Available)"}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <button
          className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => setShowSlotModal(false)}
        >
          Close
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => fetchAvailableSlots(selectedDuration)}
        >
          Refresh Slots
        </button>
      </div>
    </div>
  </div>
)}
   
     {/* Confirmation Modal */}
{showConfirmationModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-md">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Confirm Your Booking</h3>
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <p className="dark:text-gray-300">
            <span className="font-semibold">Slot:</span> {confirmedSlot.startHour % 12 || 12}:00 {confirmedSlot.startHour < 12 ? 'AM' : 'PM'} - {confirmedSlot.endHour % 12 || 12}:00 {confirmedSlot.endHour < 12 ? 'AM' : 'PM'}
          </p>
          <p className="dark:text-gray-300">
            <span className="font-semibold">Duration:</span> {selectedDuration} hour{selectedDuration > 1 ? 's' : ''}
          </p>
          <p className="text-lg font-bold dark:text-white mt-2">
            Total Amount: ₹{selectedDuration === 1 ? 30 : 
                            selectedDuration === 3 ? 90 : 
                            selectedDuration === 6 ? 180 : 
                            selectedDuration === 12 ? 360 : 0}
          </p>
          <p className="text-sm mt-2 dark:text-gray-300">
            <WalletIcon className="inline w-4 h-4 mr-1" />
            Wallet Balance: ₹{walletBalance}||0
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => setShowConfirmationModal(false)}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          onClick={handleConfirmBooking}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Continue to Payment
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}

{/* Authentication Modal */}
{showAuthModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Confirm Payment</h3>
      <p className="mb-4 dark:text-gray-300">Please enter your credentials to confirm the payment.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your password"
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          onClick={() => {
            setShowAuthModal(false);
            setUsername('');
            setPassword('');
          }}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={async () => {
            try {
              setIsProcessing(true);
              const duration = Number(selectedDuration);
              const pricing = { 1: 30, 3: 90, 6: 180, 12: 360 };
              const amount = pricing[duration] || 0;
              
              const token = localStorage.getItem('token');
              const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
              
              if (!pendingPost?.draftId) {
                toast.error("No draft post found");
                return;
              }

              // Verify credentials first
              const authResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/verify-credentials`,
                { username, password },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (!authResponse.data.valid) {
                throw new Error("Invalid credentials");
              }

              // Process payment
              const paymentResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/pay-from-wallet`,
                {
                  postId: pendingPost.draftId,
                  amount,
                  duration,
                  startHour: confirmedSlot.startHour,
                  endHour: confirmedSlot.endHour,
                  stickyStartUTC: confirmedSlot.stickyStartUTC,
                  stickyEndUTC: confirmedSlot.stickyEndUTC
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (paymentResponse.data.success) {
                toast.success(`Payment successful! Your post will be pinned on ${confirmedSlot.date} at ${confirmedSlot.time}.`);
                setWalletBalance(walletBalance - amount);
                setShowAuthModal(false);
                setShowConfirmationModal(false);
              }
            } catch (error) {
              console.error("Payment error:", error);
              toast.error(error.response?.data?.error || "Payment failed");
            } finally {
              setIsProcessing(false);
            }
          }}
          disabled={isProcessing || !username || !password}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  </div>
)}

{/* Insufficient Balance Modal */}
{showInsufficientBalanceModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2 dark:text-white">Insufficient Balance</h3>
      <p className="mb-4 dark:text-gray-300">
        You don't have enough points in your wallet to complete this transaction.
        Please recharge your wallet to continue.
      </p>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setShowInsufficientBalanceModal(false);
            setShowConfirmationModal(false);
            navigate('/wallet');
          }}
        >
          Go to Wallet
        </button>
      </div>
    </div>
  </div>
)}
    </div>
 )
       
} 
    