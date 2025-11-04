import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import wallpaper from '../assets/planet.jpg'
import reward from '../assets/logoSWM.png'
import report from '../assets/store.png'
import About from "./About";
import { Link } from 'react-router-dom'
import Pickup from '../components/Pickup'
import ReportWaste from "../components/ReportWaste";
const Home = () => {

    const { user, setUser } = useUser();
    const navigate = useNavigate();


    return (

        <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
            {!user ? (<>
                <img src={wallpaper} alt="" className='h-auto max-h-80 w-auto max-w-full object-contain' />
                <h1 className="text-4xl md:text-5xl font-bold text-green-600 m-4">
                    Smart Waste Management System
                </h1>
                <p className="max-w-2xl text-gray-600 mb-6">
                    A platform to track, recycle, and contribute to a cleaner planet.
                    Together we support Sustainable Development Goals.
                </p>
                <div className="flex gap-4">
                    <Link to="/login">
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition">
                            Get Started
                        </button>
                    </Link>
                    <button className="border border-green-600 text-green-600 px-6 py-2 cursor-pointer rounded-lg hover:bg-green-50 transition">
                        Learn More
                    </button>
                </div>
                <About />
            </>) : (<><h1 className="text-4xl md:text-5xl font-bold text-green-600 m-4">
                Welcome Back, {user.fullName}
            </h1>
                <div className="flex flex-col items-center mt-10 px-6">
                    {/* Main Info Card */}
                    <div className="bg-white border border-green-200 shadow-md rounded-2xl p-8 max-w-3xl text-center">
                        <h2 className="text-3xl font-bold text-green-700 mb-4">
                            Why Waste Management Matters
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Effective waste management plays a crucial role in achieving the United Nations’ Sustainable Development Goals (SDGs),
                            especially those related to health, clean water, sustainable cities, and climate action.
                            By reducing waste, recycling efficiently, and ensuring proper disposal, we help minimize pollution, conserve natural resources,
                            and create a cleaner, safer environment for everyone.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            If you notice uncollected waste around your area, please
                            <span className="font-semibold text-green-700"> report it immediately </span>
                            through our platform. You can also drop your waste at the nearest collection center or
                            request a <span className="font-semibold text-green-700">doorstep pickup</span>
                            to alert the admin team. Together, small actions today will build a more sustainable tomorrow.
                        </p>
                    </div>

                    {/* Reward Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        {/* Card 1 */}
                        <div className="rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
                            <img
                                src={report}
                                alt="Report Waste"
                                className="w-48 h-48 mx-auto mb-4 object-contain"
                            />
                            <h3 className="text-xl font-semibold text-green-700 mb-2">
                                Report Waste & Earn Points
                            </h3>
                            <p className="text-gray-700">
                                Every time you report uncollected waste and it gets verified by our team,
                                you’ll earn reward points for your contribution toward a cleaner community.
                            </p>
                            <div className="flex justify-center gap-4 mt-6">
                                <ReportWaste />
                                <div>
                                    <Pickup />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className=" rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
                            <img
                                src={reward}
                                alt="Earn Rewards"
                                className="w-48 h-48 mx-auto mb-4 object-contain"
                            />
                            <h3 className="text-xl font-semibold text-green-700 mb-2">
                                Turn Your Impact Into Rewards
                            </h3>
                            <p className="text-gray-700">
                                Verified reports help reduce unmanaged waste.
                                Keep contributing regularly and unlock exciting rewards and recognition for your eco-friendly actions!
                            </p>
                            <div className="flex justify-center gap-4 mt-6">
                                <button onClick={() => navigate("/dashboard")} className="bg-green-600 text-white px-6 py-2 mt-9 rounded-lg hover:bg-green-700 transition">
                                    View profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>)}
        </section>
    )
}

export default Home