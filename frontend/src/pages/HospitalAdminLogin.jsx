import React, {useState} from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignin } from "../hooks/useSignin";
import background from '../assets/hospital.jpg'; // Ensure this path is correct

export default function HospitalAdminLogin() {
  const navigate = useNavigate(); 
    const [formData, setFormData] = useState({});
    const {signinHD, loading, error} = useSignin();
  
    const HandleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value.trim()});
    };
  
    const HandleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) {
        return setErrorMessage('Please fill out all fields');
      }
     await signinHD(formData);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-10">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="w-1/2 hidden md:block">
          <img src={background} alt="Hospital Admin" className="w-full h-full object-cover" />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-md">
            Hospital Admin Login
          </h2>
          <form className="space-y-8" onSubmit={HandleSubmit}>
            {/* Admin Email Input */}
            <div>
              <Label htmlFor="adminEmail" value="Admin Email" className="text-gray-700 font-medium" />
              <TextInput
                id="email"
                type="email"
                placeholder="admin@example.com"
                onChange={HandleChange}
                required
                className="mt-3 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={HandleChange}
                required
                className="mt-3 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}