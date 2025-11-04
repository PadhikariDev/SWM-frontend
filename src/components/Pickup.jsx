import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useUser } from "../context/UserContext"; // ✅ Import context

// Fix default Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component for picking a location on the map
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

const Pickup = () => {
    const { user } = useUser(); // ✅ Get logged-in user from context
    const [showModal, setShowModal] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState("");
    const [centerStatus, setCenterStatus] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => (document.body.style.overflow = "auto");
    }, [showModal]);

    const centers = [
        { name: "Green Valley Center", status: "High Traffic" },
        { name: "EcoPoint Facility", status: "Available" },
        { name: "ReLeaf Depot", status: "Low Capacity" },
    ];

    const handleCenterChange = (e) => {
        const center = centers.find((c) => c.name === e.target.value);
        if (center) {
            setSelectedCenter(center.name);
            setCenterStatus(center.status);
        } else {
            setSelectedCenter("");
            setCenterStatus("");
        }
    };

    const handleConfirm = async () => {
        if (!user) {
            alert("⚠️ Please log in first to schedule a pickup.");
            return;
        }

        if (!selectedLocation || !selectedCenter) {
            alert("Please choose both location and collection center!");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                "https://swm-backend.onrender.com/api/pickup",
                {
                    userId: user._id,
                    pickupLocation: {
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                    },
                    collectionCenter: selectedCenter,
                    trafficStatus: centerStatus,
                },
                { withCredentials: true }
            );
            alert("✅ Pickup Scheduled Successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error scheduling pickup:", error);
            alert("❌ Failed to schedule pickup. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center mt-8">
            <button
                className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition"
                onClick={() => setShowModal(true)}
            >
                Schedule Pickup
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold text-green-700 mb-4">
                            Schedule Waste Pickup
                        </h2>

                        {/* Location Picker */}
                        <div className="mb-4 text-left">
                            <label className="block text-gray-700 font-medium mb-2">
                                Choose Your Location:
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
                                    <LocationPicker onSelect={(pos) => setSelectedLocation(pos)} />
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

                        {/* Center Selector */}
                        <div className="mb-4 text-left">
                            <label className="block text-gray-700 font-medium mb-2">
                                Select Collection Center:
                            </label>
                            <select
                                onChange={handleCenterChange}
                                value={selectedCenter}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="">-- Choose Center --</option>
                                {centers.map((center, index) => (
                                    <option key={index} value={center.name}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Center Status */}
                        {centerStatus && (
                            <div className="mb-4 text-left bg-green-50 p-3 rounded-lg border border-green-100">
                                <p className="text-gray-800">
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span
                                        className={
                                            centerStatus === "High Traffic"
                                                ? "text-red-600"
                                                : centerStatus === "Available"
                                                    ? "text-green-600"
                                                    : "text-yellow-600"
                                        }
                                    >
                                        {centerStatus}
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full disabled:opacity-50"
                        >
                            {loading ? "Scheduling..." : "Confirm Pickup"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pickup;
