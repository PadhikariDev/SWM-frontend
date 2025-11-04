import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [communityOpenDesktop, setCommunityOpenDesktop] = useState(false);
    const [communityOpenMobile, setCommunityOpenMobile] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const desktopRef = useRef(null);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    // Detect click outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(e) {
            if (desktopRef.current && !desktopRef.current.contains(e.target)) {
                setCommunityOpenDesktop(false);
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Logout
    const handleLogout = async () => {
        console.log("Logout clicked");
        try {
            await axios.post("https://swm-backend.onrender.com/api/logout", {}, { withCredentials: true });
            setUser(null);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <nav className="bg-white text-gray-800 shadow-sm px-6 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link
                        to="/"
                        className="normal-case text-2xl font-semibold text-green-600"
                    >
                        Smart <span className="text-green-800">Waste</span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:items-center lg:space-x-10">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="text-[16px] font-medium hover:text-green-600 transition-colors duration-200"
                    >
                        Home
                    </Link>

                    {/* Desktop Dropdown */}
                    <div className="relative" ref={desktopRef}>
                        <button
                            onClick={() => setCommunityOpenDesktop((prev) => !prev)}
                            className="flex items-center gap-2 text-[16px] font-medium hover:text-green-600 transition-colors duration-200 cursor-pointer"
                        >
                            <span>Community</span>
                            <svg
                                className={`h-4 w-4 transform transition-transform duration-200 ${communityOpenDesktop ? "rotate-180" : "rotate-0"
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {communityOpenDesktop && (
                            <div className="absolute left-0 top-full mt-2 w-44 rounded-lg bg-white shadow-lg py-2 text-sm">
                                <a
                                    href="#discussion"
                                    className="block px-4 py-2 hover:text-green-600"
                                >
                                    Discussion
                                </a>
                                <a
                                    href="#articles"
                                    className="block px-4 py-2 hover:text-green-600"
                                >
                                    Articles
                                </a>
                            </div>
                        )}
                    </div>

                    <Link
                        onClick={() => {
                            const section = document.getElementById("about");
                            if (section) {
                                section.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="text-[16px] font-medium hover:text-green-600 transition-colors duration-200"
                    >
                        About
                    </Link>
                </div>

                {/* Right Side (Login or User Dropdown) */}
                <div className="flex items-center gap-4 relative">
                    {!user ? (
                        <Link
                            to="/Login"
                            className="hidden md:inline-block px-5 py-2 rounded-lg font-semibold text-white bg-linear-to-r from-green-500 to-emerald-600 hover:opacity-95 transition-all duration-300 shadow-md"
                        >
                            Join Us
                        </Link>
                    ) : (
                        <div className="relative" ref={desktopRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="hidden md:inline-block px-5 py-2 rounded-lg font-semibold text-gray-700  hover:opacity-65 transition-all duration-300 border cursor-pointer"
                            >
                                {user.fullName.split(" ")[0].trim()}
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Toggle Button */}
                    <button
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-expanded={mobileOpen}
                        aria-label="Toggle menu"
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden transition-all duration-200 ${mobileOpen
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
            >
                <div className="px-4 pb-4">
                    <a href="#home" className="block py-2 font-medium hover:text-green-600">
                        Home
                    </a>
                    <div className="mt-1">
                        <button
                            onClick={() => setCommunityOpenMobile((prev) => !prev)}
                            className="w-full flex items-center justify-between py-2 font-medium hover:text-green-600 cursor-pointer"
                        >
                            <span>Community</span>
                            <svg
                                className={`h-4 w-4 transform transition-transform duration-200 ${communityOpenMobile ? "rotate-180" : "rotate-0"
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <div className={`${communityOpenMobile ? "block" : "hidden"} pl-4`}>
                            <a href="#discussion" className="block py-2 hover:text-green-600">
                                Discussion
                            </a>
                            <a href="#articles" className="block py-2 hover:text-green-600">
                                Articles
                            </a>
                        </div>
                    </div>
                    <a href="#about" className="block py-2 font-medium hover:text-green-600">
                        About
                    </a>

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="block w-full mt-3 text-left py-2 font-semibold text-red-600 hover:text-red-700"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/Login"
                            className="block mt-3 py-2 font-semibold text-green-600 hover:text-green-700"
                        >
                            Join Us
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
