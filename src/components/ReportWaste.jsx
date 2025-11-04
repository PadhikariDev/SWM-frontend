import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useUser } from "../context/UserContext";

// Fix default marker issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
    const [position, setPosition] = useState(null);
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onSelect(e.latlng);
        },
    });
    return position ? <Marker position={position}></Marker> : null;
}

const ReportWaste = () => {
    const [showModal, setShowModal] = useState(false);
    const [wasteImage, setWasteImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [aiResult, setAiResult] = useState({ weight: null, emission: null });
    const { user } = useUser(); // 👈 logged-in user from context

    // 🧠 Prevent background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [showModal]);

    // 🖼 Handle Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setWasteImage(URL.createObjectURL(file));

            // 🔮 Simulate AI estimation
            setTimeout(() => {
                const randomWeight = (Math.random() * 5 + 0.5).toFixed(2);
                const emission = (randomWeight * 1.8).toFixed(2);
                setAiResult({
                    weight: `${randomWeight} kg`,
                    emission: `${emission} kg CO₂`,
                });
            }, 1500);
        }
    };

    // 🧾 Handle Submit
    const handleSubmit = async () => {
        if (!user) {
            alert("Please log in to report waste.");
            return;
        }

        if (!imageFile || !selectedLocation) {
            alert("Please upload an image and mark the waste location.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("latitude", selectedLocation.lat);
        formData.append("longitude", selectedLocation.lng);
        formData.append("estimatedWeight", aiResult.weight);
        formData.append("carbonEmission", aiResult.emission);
        formData.append("wasteImage", imageFile);

        try {
            const res = await axios.post("https://swm-backend.onrender.com/api/reportWaste", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                alert("✅ Waste Reported Successfully!");
                setShowModal(false);
                setWasteImage(null);
                setSelectedLocation(null);
                setAiResult({ weight: null, emission: null });
            }
        } catch (err) {
            console.error("Error reporting waste:", err);
            alert("❌ Failed to report waste. Please try again.");
        }
    };

    return (
        <div className="text-center mt-8">
            {/* Button to open modal */}
            <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                onClick={() => setShowModal(true)}
            >
                Report Waste
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative my-8 max-h-[90vh] overflow-y-auto sm:rounded-2xl sm:mx-0 mx-4">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Heading */}
                        <h2 className="text-2xl font-bold text-green-700 mb-4 mt-2 text-center">
                            Report Nearby Waste
                        </h2>

                        {/* Upload Image */}
                        <div className="mb-4 text-left">
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Waste Image:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
                            />
                            {wasteImage && (
                                <img
                                    src={wasteImage}
                                    alt="Waste preview"
                                    className="mt-3 rounded-lg w-full h-38 object-cover border"
                                />
                            )}
                        </div>

                        {/* Location Picker */}
                        <div className="mb-4 text-left">
                            <label className="block text-gray-700 font-medium mb-2">
                                Mark Waste Location:
                            </label>
                            <div className="w-full h-64 rounded-lg overflow-hidden border">
                                <MapContainer
                                    center={[20.5937, 78.9629]}
                                    zoom={5}
                                    className="h-64 w-full z-0"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />
                                    <LocationPicker
                                        onSelect={(pos) => setSelectedLocation(pos)}
                                    />
                                </MapContainer>
                            </div>
                            {selectedLocation && (
                                <p className="text-sm text-gray-600 mt-2">
                                    📍 Selected:{" "}
                                    <span className="font-semibold">
                                        {selectedLocation.lat.toFixed(4)},{" "}
                                        {selectedLocation.lng.toFixed(4)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* AI Estimation */}
                        {aiResult.weight && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-4 text-left">
                                <p className="text-gray-800">
                                    <span className="font-semibold">
                                        Estimated Weight:
                                    </span>{" "}
                                    {aiResult.weight}
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-semibold">
                                        Carbon Emission:
                                    </span>{" "}
                                    {aiResult.emission}
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full"
                        >
                            Submit Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportWaste;
