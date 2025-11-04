import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-linear-to-r from-green-900 via-emerald-800 to-green-900 text-gray-200 text-center py-8 mt-10 shadow-inner">
            <div className="max-w-4xl mx-auto px-4 space-y-3">
                <h3 className="text-lg font-semibold text-green-100 tracking-wide">
                    Smart Waste Management & Recycling System
                </h3>
                <p className="text-sm text-green-200 leading-relaxed">
                    Building a cleaner, smarter, and more sustainable city through technology-driven waste
                    management and community participation. Together, we’re working toward a greener future.
                </p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
                </div>
                <div className="pt-4 border-t border-green-700/40">
                    <p className="text-sm text-green-300">
                        © {new Date().getFullYear()} Smart Waste Management System | Supporting <span className="text-green-200 font-medium">SDG 11</span> & <span className="text-green-200 font-medium">SDG 12</span> 🌍
                    </p>
                </div>
            </div>
        </footer>

    )
}

export default Footer