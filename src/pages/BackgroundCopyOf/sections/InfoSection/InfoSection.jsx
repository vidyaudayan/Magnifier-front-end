import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../../../componenets/Welcome/button";
import { Card, CardContent } from "../../../../componenets/Welcome/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../componenets/Welcome/select";
import Modal from "react-modal";

export const InfoSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    username: "",
    organization: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();

    if (selectedFile) {
      form.append("identityProof", selectedFile);
    } else {
      alert("Please upload an identity proof.");
      setIsSubmitting(false);
      return;
    }

    form.append("contactDetails", JSON.stringify(formData));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/contact`,
        form
      );
      alert(response.data.message || "Form submitted successfully!");
      setModalIsOpen(true);
      // Reset form
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        username: "",
        organization: "",
        phone: "",
        email: "",
        message: "",
      });
      setSelectedFile(null);
    } catch (error) {
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-16 flex flex-col items-center justify-center">
      <div className="max-w-[600px] text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-2 h-2 bg-[#578cff] rounded-full mr-2"></div>
          <span className="font-normal text-base text-[#292929] tracking-[-0.16px]">
            Contact
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-normal text-[46px] text-[#292929] tracking-[-1.38px] leading-[55.2px]">
            Your Voice Matters
          </h2>
          <h3 className="font-normal text-[46px] text-[#292929] tracking-[-1.38px] leading-[55.2px]">
            Contact Us
          </h3>
        </div>
      </div>

      <Card className="w-full max-w-[800px] rounded-[28px] border border-solid border-[#ddd7d7]">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2">Full Name *</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
              />
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="18"
                  className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">Gender *</label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 shadow-md">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Username and Organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">
                  Web Magnifier Username *
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">
                  Organization/Political Party Name *
                </label>
                <input
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
                />
              </div>
            </div>

            {/* Identity Proof Upload */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2">
                Identity Proof (Office ID card/party membership card) *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-[#ddd7d7] border-dashed cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG or JPEG (MAX. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#292929] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#292929] mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-[#ddd7d7] focus:outline-none focus:ring-2 focus:ring-[#578cff]"
              />
            </div>

            <div className="text-sm text-gray-500 italic">
              Privacy Note: All information submitted is strictly confidential and used only for verification and communication purposes.
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-8 py-2 h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] bg-blue-600"
                disabled={isSubmitting} // disables the button
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
  isOpen={modalIsOpen}
  onRequestClose={() => setModalIsOpen(false)}
  className="fixed inset-0 flex items-center justify-center p-4"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
>
  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-auto z-50 transition-transform duration-300 transform scale-100">
    <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">🎉 Thank You!</h2>
    <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
      <li>✅ <strong>Confirmation:</strong> You will receive an email confirming that we have received your inquiry.</li>
      <li>🔍 <strong>Verification:</strong> Our team will review your details and verify your identity proof or membership card.</li>
      <li>⏳ <strong>Response Time:</strong> Expect a response within 3-5 business days.</li>
      <li>🚀 <strong>Next Steps:</strong> We will guide you through the subscription process.</li>
      <li>🔒 <strong>Privacy Note:</strong> All information submitted is strictly confidential and used only for verification and communication purposes.</li>
    </ul>
    <div className="text-center mt-6">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
        onClick={() => setModalIsOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
</Modal>

    </section>
  );
};