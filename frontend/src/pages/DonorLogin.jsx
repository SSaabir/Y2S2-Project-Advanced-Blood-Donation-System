import React, { useState } from "react";
import { Button, Card, Label, TextInput, Checkbox, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignin } from '../hooks/useSignin';
import { toast } from 'react-toastify';

export default function DonorLogin() {
  const navigate = useNavigate();
  const { signinD, loading } = useSignin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value.trim(),
    }));
    if (id !== 'rememberMe') setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form and handle client-side errors
    if (!validateForm()) {
      if (errors.email) toast.error(errors.email);
      if (errors.password) toast.error(errors.password);
      return;
    }

    try {
      await signinD(formData); // Let useSignin handle success (toast, navigation)
    } catch (err) {
      // Handle network or unexpected errors
      const errorMsg =
        err?.response?.data?.error ||
        (err.message === 'Network Error'
          ? 'Network error. Please check your connection.'
          : 'Login failed. Please try again.');
      handleErrorResponse(errorMsg);
    }
  };

  // Helper function to handle errors consistently
  const handleErrorResponse = (errorMsg) => {
    const lowerMsg = errorMsg.toLowerCase();

    if (lowerMsg.includes('password')) {
      toast.error('Incorrect password. Please try again.');
      setErrors((prev) => ({ ...prev, password: 'Incorrect password' }));
    } else if (lowerMsg.includes('email') || lowerMsg.includes('user')) {
      toast.error('Email not found. Please check your email or register.');
      setErrors((prev) => ({ ...prev, email: 'Email not found' }));
    } else {
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 via-pink-200 to-purple-200 animate-gradient-x p-6">
      <Card className="relative w-full max-w-md p-8 bg-white/85 backdrop-blur-3xl rounded-3xl shadow-xl border border-red-300/20 transition-all duration-300 hover:shadow-2xl hover:scale-102">
        <Button
          onClick={() => navigate("/Hospital_login")}
          size="sm"
          className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-none hover:from-red-600 hover:to-pink-600 focus:ring-4 focus:ring-red-300 transition-all duration-300 rounded-full"
        >
          Hospital Login
        </Button>

        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent mb-8 tracking-tight drop-shadow-md">
          DonorLogin
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label 
              htmlFor="email" 
              value="Email" 
              className="text-gray-900 font-semibold tracking-wide" 
            />
            <TextInput
              id="email"
              type="email"
              placeholder="donor@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              color={errors.email ? 'failure' : 'gray'}
              className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300 bg-white/50"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1.5 font-medium animate-pulse">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label 
              htmlFor="password" 
              value="Password" 
              className="text-gray-900 font-semibold tracking-wide" 
            />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
              color={errors.password ? 'failure' : 'gray'}
              className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300 bg-white/50"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1.5 font-medium animate-pulse">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 text-red-600 focus:ring-red-400 border-gray-300 rounded"
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-red-700 hover:to-pink-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <p className="text-center text-sm text-gray-700 font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => navigate("/register")}
              className="text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </form>
      </Card>
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 12s ease infinite;
        }
      `}</style>
    </div>
  );
}