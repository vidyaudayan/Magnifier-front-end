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
  

  useEffect(() => {
    socket.on("updateSlots", () => {
      fetchPendingPosts();  // Refresh the posts when a slot is booked
    });

    return () => {
      socket.off("updateSlots");
    };
  }, []);

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

  const fetchAvailableSlots = async (duration) => {
    if (!duration) {
      console.error("Invalid duration:", duration);
      return;
    }

    try {
      console.log("Fetching slots for duration:", duration);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/available-slots?duration=${duration}`);
      setAvailableSlots(response.data);
      console.log("Slots received:", response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };



  const handleDurationChange = (event) => {
    const selectedHours = parseInt(event.target.value, 10);

    setSelectedDuration(selectedHours);
    //setSelectedPostId(postId);
    fetchAvailableSlots(selectedHours); // Fetch slots for selected duration
    setShowSlotModal(true); // Show modal
  };




  const handleSlotSelection = async (slot) => {
    try {


      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/book-slot`, {
        postId: selectedPostId,
        startHour: slot.startHour,
        endHour: slot.endHour
      });

      toast.success("Slot booked successfully!");
      setShowSlotModal(false);
      setConfirmedSlot(slot);  
  setShowConfirmationModal(true);
      socket.emit("slotBooked");
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot.");
    }
  };

  const handleConfirmBooking = async () => {
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Select a Slot</h3>
            {availableSlots.length === 0 ? (
              <p className="text-gray-500">No available slots.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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


{showConfirmationModal && confirmedSlot && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-1/2">
      <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
      <p className="text-gray-700">
        You've selected a slot from <strong>{confirmedSlot.startHour}:00</strong> 
        to <strong>{confirmedSlot.endHour}:00</strong> for <strong>{selectedDuration} hours</strong>.
      </p>
      <p className="mt-2 text-gray-500">Do you want to proceed to payment?</p>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => setShowConfirmationModal(false)}
        >
          Cancel
        </button>
        <button
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/payment")}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
