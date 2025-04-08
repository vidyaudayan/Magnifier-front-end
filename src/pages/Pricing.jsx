import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import image from "../assets/Images/pricing.avif";
import NavbarLanding from "../componenets/NavbarLanding.jsx";

const socket = io("http://localhost:3000"); // Change to your backend URL

export default function PricingPage() {
  const [selectedDuration, setSelectedDuration] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  const [stickyDurations, setStickyDurations] = useState({});
  const [showSlotModal, setShowSlotModal] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  

  {/*useEffect(() => {
    socket.on("updateSlots", () => {
      fetchPendingPosts();  // Refresh the posts when a slot is booked
    });

    return () => {
      socket.off("updateSlots");
    };
  }, []);*/}

  useEffect(() => {


    // **Listen for slot booking updates**
    socket.on("slotBooked", ({ startHour, endHour }) => {
      console.log(`Slot booked from ${startHour} to ${endHour}`);
      //fetchAvailableSlots(stickyDurations[selectedPostId] / (60 * 60 * 1000)); // Refresh slots
      const duration = stickyDurations[selectedPostId] || 0; // Ensure it's a valid number
      fetchAvailableSlots(duration);

    });

   

    return () => {
      socket.off("slotBooked");
    };
  }, []);


  useEffect(() => {
    socket.on("slotBooked", (bookedSlot) => {
      // Remove the booked slot from available slots
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
  const fetchAvailableSlots = async (duration) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/available-slots`,
        {
          params: { duration: Number(duration) },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Validate slots before setting state
      const validSlots = response.data.filter(slot => 
        Number(slot.startHour) < Number(slot.endHour)
      );
  
      setAvailableSlots(validSlots);
    } catch (error) {
      console.error("Error fetching slots:", error.response?.data || error.message);
    }
  };

  
useEffect(() => {
  const handleSlotBooked = (bookedSlot) => {
      setAvailableSlots(prev => 
          prev.filter(s => 
              !(s.startHour === bookedSlot.startHour && 
                s.endHour === bookedSlot.endHour)
          )
      );
  };

  const handleSlotReleased = (releasedSlot) => {
      if (releasedSlot.duration === selectedDuration) {
          setAvailableSlots(prev => [...prev, releasedSlot]);
      }
  };

  socket.on("slotBooked", handleSlotBooked);
  socket.on("slotReleased", handleSlotReleased);

  return () => {
      socket.off("slotBooked", handleSlotBooked);
      socket.off("slotReleased", handleSlotReleased);
  };
}, [selectedDuration]);


  const handleDurationChange = (event) => {
    const selectedHours = parseInt(event.target.value, 10);

    setSelectedDuration(selectedHours);
    //setSelectedPostId(postId);
    fetchAvailableSlots(selectedHours); // Fetch slots for selected duration
    setShowSlotModal(true); // Show modal
  };




  {/*const handleSlotSelection = async (slot) => {
    try {

       // Convert to numbers explicitly
    const startHour = Number(slot.startHour);
    const endHour = Number(slot.endHour);
    const duration = Number(selectedDuration)
   // Get the correct post ID from localStorage
   const pendingPost = JSON.parse(localStorage.getItem('pendingPost'));
   const postId = pendingPost?.draftId;

   if (!postId) {
     toast.error("No draft post found");
     return;
   }


    // Client-side validation
    if (startHour >= endHour) {
      toast.error("End time must be after start time");
      return;
    }


      const token = localStorage.getItem('token');
const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/book-slot`,{
    
        startHour,
        endHour,duration,postId
      },{
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensure this matches your backend's CORS setup
      }, );

      if (response.data.success) {
        toast.success("Slot booked successfully!");
        setShowSlotModal(false);
        //setConfirmedSlot(slot);
        setConfirmedSlot({ startHour, endHour,duration })
        setShowConfirmationModal(true);
        socket.emit("slotBooked");
      } else {
        toast.error(response.data.error || "Failed to book slot");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot.");
    }
  };*/}

  {/*const handleConfirmBooking = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/book-slot`, {
        startHour: confirmedSlot.startHour,
        endHour: confirmedSlot.endHour,
      });
  
      toast.success("Slot booked successfully!");
      setShowConfirmationModal(false);
      socket.emit("slotBooked");
  
      // Navigate to the post creation page with slot details
      navigate("/create-post", {
        state: {
          duration: selectedDuration,
          startHour: confirmedSlot.startHour,
          endHour: confirmedSlot.endHour,
        },
      });
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot.");
    }
  };*/}

  const handleSlotSelection = async (slot) => {
    try {
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
          endHour: slot.endHour,
          duration: selectedDuration,
          postId: pendingPost.draftId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data.success) {
        toast.success("Slot reserved!");
        setConfirmedSlot(slot);
        setShowConfirmationModal(true);
        socket.emit("slotBooked"); // Notify other clients
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Booking failed");
    }
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
      navigate("/payment", {
        state: {
          duration,
          startHour: confirmedSlot.startHour,
          endHour: confirmedSlot.endHour, amount, currency: "INR"
        },
      });
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to proceed to payment.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarLanding />

      {/* Hero Section */}
      <div className="container mt-28 mx-auto flex flex-col md:flex-row items-center bg-white p-8 shadow-lg rounded-lg">
        <div className="w-full md:w-1/2">
          <img src={image} alt="Pin Post Promotion" className="rounded-lg w-full" />
        </div>
        <div className="w-full md:w-1/2 p-5">
          <h2 className="text-3xl font-bold text-gray-800">
            Boost Your Visibility with Pinned Posts!
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Pin your post at the top and increase engagement! Select the perfect
            time slot and ensure maximum reach.
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
    Pricing Details for Pinned Posts
  </h3>

  {/* Price Table */}
  <div className="overflow-x-auto">
    <table className="w-full md:w-1/2 mx-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Price (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-gray-100">
          <td className="border border-gray-300 px-4 py-2">1 Hour</td>
          <td className="border border-gray-300 px-4 py-2">₹30</td>
        </tr>
        <tr className="bg-white">
          <td className="border border-gray-300 px-4 py-2">3 Hours</td>
          <td className="border border-gray-300 px-4 py-2">₹90</td>
        </tr>
        <tr className="bg-gray-100">
          <td className="border border-gray-300 px-4 py-2">6 Hours</td>
          <td className="border border-gray-300 px-4 py-2">₹180</td>
        </tr>
        <tr className="bg-white">
          <td className="border border-gray-300 px-4 py-2">12 Hours</td>
          <td className="border border-gray-300 px-4 py-2">₹360</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      {/* Pricing Table & Slot Selection */}
      <div className="container mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Choose Your Pinning Slot
        </h3>

        {/* Duration Selection */}
        <div className="mt-6 text-center">
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Select a Slot Duration:
          </label>
          <select
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg"
            value={selectedDuration}
            onChange={handleDurationChange}

          >
            <option value="">Select Duration</option>
            <option value="1">1 Hour</option>
            <option value="3">3 Hours</option>
            <option value="6">6 Hours</option>
            <option value="12">12 Hours</option>
          </select>
        </div>

    
        




{showSlotModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-4">Select a Slot</h3>
      
      {availableSlots.length === 0 ? (
        <p className="text-gray-500">No available slots.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-80">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
              onClick={() => handleSlotSelection(slot)}
            >
              {slot.startHour}:00 - {slot.endHour}:00
            </button>
          ))}
        </div>
      )}

      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => setShowSlotModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
{showConfirmationModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Slot Booked Successfully!</h3>
      <p className="mb-4">
        Your slot from {confirmedSlot.startHour}:00 to {confirmedSlot.endHour}:00 has been reserved.
      </p>
      <p className="mb-4 font-bold">
        Total Amount: ₹{selectedDuration === 1 ? 30 : 
                        selectedDuration === 3? 90 : 
                        selectedDuration === 6 ? 180 : 
                        selectedDuration == 12 ? 360 : 0}
      </p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setShowConfirmationModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleConfirmBooking}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
