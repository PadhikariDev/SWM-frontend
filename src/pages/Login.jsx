import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Login = () => {

    const { setUser } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    //handlechange 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    //submit
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        // ✅ Hardcoded admin login
        if (email === "admin@swm.com" && password === "admin") {
            localStorage.setItem("role", "admin");
            navigate("/admin-dashboard");
            return;
        }
        try {
            const res = await axios.post("https://swm-backend.onrender.com/api/login", formData, { withCredentials: true });
            alert("logged in");
            setUser(res.data.user);
            navigate("/");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Login failed.")
            setFormData({ email: "", password: "" });
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
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Login to your Smart Waste account to continue
                </p>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-linear-to-r from-green-500 cursor-pointer to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to='/register' className="text-green-600 font-medium hover:underline">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
