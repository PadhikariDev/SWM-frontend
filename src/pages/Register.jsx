import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const Register = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    })
    const navigate = useNavigate();

    //handling inputchange
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    //handling form submit
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://swm-backend.onrender.com/api/register", formData);
            alert("Registration successfull!");
            navigate("/login");
        } catch (err) {
            console.err(err);
            alert(err.response?.data?.message || "Registration failed.")
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-100">
                <h2 className="text-center text-gray-600 text-2xl m-6">
                    <Link to='/' className="text-green-600 font-medium">
                        Smart <span className="text-green-800">Waste</span>
                    </Link>
                </h2>
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Join the Smart Waste community and be part of a cleaner, greener future 🌱
                </p>

                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 cursor-pointer transition-all duration-300"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-green-600 font-medium hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
