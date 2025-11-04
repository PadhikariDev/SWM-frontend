import aboutImg1 from "../assets/about-cleanup.jpg";
import aboutImg2 from "../assets/about-recycle.jpg";
import aboutImg3 from "../assets/about-community.jpg";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <div id="about" className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 py-20 px-6 md:px-20 font-inter">
            {/* Heading */}
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                    About <span className="text-green-600">Smart Waste Management</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Empowering communities with smart, sustainable, and tech-driven waste
                    management solutions — one report at a time.
                </p>
            </div>

            {/* Intro Section */}
            <section className="flex flex-col md:flex-row items-center gap-10 mb-24">
                <img
                    src={aboutImg1}
                    alt="Cleanup initiative"
                    className="w-full md:w-[40%] rounded-xl shadow-md object-cover"
                />
                <div className="md:w-[60%] space-y-4 text-gray-700 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                        Why Waste Management Matters ♻️
                    </h2>
                    <p className="leading-relaxed text-lg">
                        Effective waste management plays a crucial role in achieving the
                        United Nations’ Sustainable Development Goals (SDGs), especially
                        those related to health, clean water, sustainable cities, and
                        climate action. By reducing waste, recycling efficiently, and
                        ensuring proper disposal, we help minimize pollution and create a
                        cleaner environment for everyone.
                    </p>
                    <p className="leading-relaxed text-lg">
                        Every small action — whether reporting uncollected waste, scheduling
                        a pickup, or reducing daily waste — contributes to a greener
                        tomorrow.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="flex flex-col-reverse md:flex-row items-center md:items-start gap-12 mb-24 bg-linear-to-r from-green-50 via-white to-green-50 rounded-2xl p-10 shadow-sm">
                {/* Left Content */}
                <div className="md:w-[55%] text-gray-700 space-y-6 text-left">
                    <h2 className="text-3xl font-bold text-green-800 text-center">
                        Our Mission 🌍
                    </h2>

                    <p className="leading-relaxed text-gray-600 text-lg">
                        At{" "}
                        <span className="font-semibold text-green-700">
                            Smart Waste Management (SWM)
                        </span>
                        , our mission is to make sustainable waste handling simple, smart, and effective.
                        We aim to inspire communities to take eco-friendly actions through technology-driven solutions
                        that make reporting and managing waste effortless.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: "🗑️", text: "Report uncollected waste instantly" },
                            { icon: "🚛", text: "Schedule doorstep pickups easily" },
                            { icon: "📊", text: "Track and manage your waste reports" },
                            { icon: "🌱", text: "Earn Green Points for eco-friendly actions" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                            >
                                <span className="text-green-600 text-xl mt-0.5">{item.icon}</span>
                                <p className="text-gray-700 text-base leading-snug">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div className="md:w-[45%] flex justify-center md:justify-end">
                    <img
                        src={aboutImg2}
                        alt="Recycling process"
                        className="w-full md:w-[85%] rounded-2xl shadow-lg object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </section>


            {/* Vision Section */}
            <section className="flex flex-col md:flex-row items-center gap-10 mb-24">
                <img
                    src={aboutImg3}
                    alt="Community waste collection"
                    className="w-full md:w-[40%] rounded-xl shadow-md object-cover"
                />
                <div className="md:w-[60%] space-y-4 text-gray-700 text-left">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                        Our Vision 🌤️
                    </h2>
                    <p className="leading-relaxed text-lg">
                        We envision a future where smart technology bridges the gap between
                        citizens, local authorities, and the environment — making waste
                        management not just efficient but impactful.
                    </p>
                    <p className="leading-relaxed text-lg ">
                        Together, we aim to build cleaner cities, reduce pollution, and
                        promote a culture of environmental responsibility through
                        collaboration and awareness.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <div className="text-center bg-white shadow-sm rounded-2xl py-12 px-6 md:px-20 border border-green-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Join the Smart Waste Revolution 🌿
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
                    Be part of a growing movement that’s transforming how we manage waste.
                    Together, we can make every report count and every action matter.
                </p>
                <button
                    onClick={handleClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition shadow-sm"
                >
                    Report Waste Now
                </button>
            </div>
        </div>
    );
};

export default About;
