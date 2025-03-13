import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get slot details from previous page
  const { duration, startHour, endHour, amount } = location.state || {};

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  // Handle payment submission
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Send payment request (Replace with actual Stripe API call)
      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/process-payment`, {
       
        duration,
        startHour,
        endHour,
        cardDetails,
      });

      toast.success("Payment successful! Your post is now pinned.");
      navigate("/success"); // Redirect to a success page
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
    setIsProcessing(false);
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
