import React, { useState } from "react";
import { Button, Card, Label, TextInput, Select, FileInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDonor } from "../hooks/donor";
import { toast } from 'react-toastify'; // Added for feedback

export default function DonorSign() {
  const navigate = useNavigate();
  const { createDonor, loading } = useDonor(); // Assuming no error per your hook pattern
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dob: "",
    bloodType: "",
    gender: "",
    city: "",
    nic: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["Male", "Female", "Other"];
  const today = new Date();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Must be a 10-digit number';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    // Optional: if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    else if (new Date(formData.dob) >= today) newErrors.dob = 'Date of birth must be in the past';
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    else if (!bloodTypes.includes(formData.bloodType)) newErrors.bloodType = 'Invalid blood type';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    else if (!genders.includes(formData.gender)) newErrors.gender = 'Invalid gender';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.nic) newErrors.nic = 'NIC is required';
    else if (!/^\d+$/.test(formData.nic)) newErrors.nic = 'NIC must be numeric';
    if (!formData.image) newErrors.image = 'Profile picture is required'; // Remove if optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const donorData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      donorData.append(key, value);
    });

    try {
      await createDonor(donorData);
      toast.success('Registration successful! Please log in.');
      navigate("/donor-login");
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error registering donor');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg">
      <Card className="w-full max-w-4xl p-10 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-md border border-red-100">
        <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 drop-shadow-md">
          Donor Registration
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="firstName" value="First Name" className="text-gray-700 font-medium" />
              <TextInput
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.firstName ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="First name"
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName" value="Last Name" className="text-gray-700 font-medium" />
              <TextInput
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.lastName ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber" value="Phone Number" className="text-gray-700 font-medium" />
              <TextInput
                id="phoneNumber"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="\d{10}"
                disabled={loading}
                color={errors.phoneNumber ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Phone number"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <Label htmlFor="email" value="Email" className="text-gray-700 font-medium" />
              <TextInput
                id="email"
                type="email"
                placeholder="donor@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.email ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Email"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.password ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Password"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="dob" value="Date of Birth" className="text-gray-700 font-medium" />
              <TextInput
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
                max={today.toISOString().split('T')[0]}
                disabled={loading}
                color={errors.dob ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Date of birth"
              />
              {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
            </div>
            <div>
              <Label htmlFor="city" value="City" className="text-gray-700 font-medium" />
              <TextInput
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.city ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="City"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="nic" value="NIC" className="text-gray-700 font-medium" />
              <TextInput
                id="nic"
                type="text"
                placeholder="Enter NIC number"
                value={formData.nic}
                onChange={handleChange}
                required
                pattern="\d+"
                disabled={loading}
                color={errors.nic ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="NIC"
              />
              {errors.nic && <p className="text-red-600 text-sm mt-1">{errors.nic}</p>}
            </div>
            <div>
              <Label htmlFor="bloodType" value="Blood Type" className="text-gray-700 font-medium" />
              <Select
                id="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.bloodType ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Blood type"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              {errors.bloodType && <p className="text-red-600 text-sm mt-1">{errors.bloodType}</p>}
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" className="text-gray-700 font-medium" />
              <Select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={loading}
                color={errors.gender ? 'failure' : 'gray'}
                className="mt-1"
                aria-label="Gender"
              >
                <option value="">Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </Select>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
            </div>
            <div>
              <Label htmlFor="image" value="Profile Picture" className="text-gray-700 font-medium" />
              <FileInput
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={loading}
                className="mt-1 text-gray-700 border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                aria-label="Profile picture upload"
              />
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-red-300 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center space-y-4">
            <Button
              type="submit"
              gradientDuoTone="redToPink"
              size="lg"
              className="w-full font-bold shadow-md hover:shadow-lg transition-shadow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Registering...
                </>
              ) : (
                'Register Now'
              )}
            </Button>
            <button
              onClick={() => navigate("/donor-login")}
              className="text-red-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}