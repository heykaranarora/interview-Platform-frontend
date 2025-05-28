import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/authSlice';
import { Loader2 } from "lucide-react";
import Navbar from '../Navbar';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.loading);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedForm = { ...prevState, [name]: value };
            // if(name === "password" || value?.length() < 6) {
            //     setPasswordError('Password must be at least 6 characters'); 
            // }
            if (updatedForm.password && updatedForm.confirmPassword) {
                if (updatedForm.password !== updatedForm.confirmPassword) {
                    setPasswordError('Passwords do not match');
                } else {
                    setPasswordError('');
                }
            }
            
            return updatedForm;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
    
        try {
            dispatch(setLoading(true));
            const res = await fetch('https://interview-platform-backend-xp3r.onrender.com/api/v1/user/register', {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
    
            const data = await res.json();
    
            if (data.success) {
                toast.success(data.message);
                navigate("/login"); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Signup failed");
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder='Enter your name'
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder='Enter your phone number'
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder='Enter your email'
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder='Enter your password'
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Confirm Password:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder='Confirm your password'
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-600 text-white font-bold py-3 rounded-md hover:bg-gray-700 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                        </button>
                        <p className='text-center mt-3'>Already have an account? <Link to='/login'><span className='text-gray-700'>Login</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
