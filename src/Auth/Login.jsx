import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../contexts/AuthContext';

import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import loginAnimation from '../assets/login.json'; // Lottie animation file

const Login = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  // Email/password login
  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/');
      window.location.reload(); // refresh context if needed
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
      setError('firebase', { type: 'manual', message: error.message });
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-green-50 px-4">
      {/* Lottie animation */}
      <div className="md:w-1/2 w-full flex justify-center mb-8 md:mb-0">
        <Player autoplay loop src={loginAnimation} className="w-80 h-80" />
      </div>

      {/* Login form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Firebase error */}
          {errors.firebase && <p className="text-red-600 text-sm">{errors.firebase.message}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
