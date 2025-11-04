import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [pickups, setPickups] = useState([]);

    // Fetch all registered users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("https://swm-backend.onrender.com/api/users");
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch details for selected user (reports + pickups)
    const fetchUserDetails = async (userId) => {
        try {
            const [reportRes, pickupRes] = await Promise.all([
                axios.get(`https://swm-backend.onrender.com/api/reportWaste/${userId}`),
                axios.get(`https://swm-backend.onrender.com/api/pickup/${userId}`),
            ]);
            setReports(reportRes.data);
            setPickups(pickupRes.data);
        } catch (error) {
            console.error("Error loading user details:", error);
        }
    };

    // Update waste report status
    const updateWasteStatus = async (id, status, userId) => {
        try {
            await axios.put(`https://swm-backend.onrender.com/api/reportWaste/${id}/status`, {
                status,
            });
            fetchUserDetails(userId);
        } catch (err) {
            console.error("Error updating waste report:", err);
        }
    };

    // Update pickup status
    const updatePickupStatus = async (id, status, userId) => {
        try {
            await axios.put(`https://swm-backend.onrender.com/api/pickup/${id}/status`, {
                status,
            });
            fetchUserDetails(userId);
        } catch (err) {
            console.error("Error updating pickup:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome back, Admin 👋
                    </h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem("role");
                            window.location.href = "/";
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Users List */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Registered Users
                </h2>

                {users.length === 0 ? (
                    <p className="text-gray-500">No users found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white shadow-md p-6 rounded-xl border border-gray-200 hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    {user.fullName}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                                <button
                                    onClick={() => {
                                        setSelectedUser(user);
                                        fetchUserDetails(user._id);
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Details Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-8 relative overflow-y-auto max-h-[90vh]">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl"
                            >
                                ×
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {selectedUser.fullName}’s Details
                            </h2>

                            {/* Waste Reports Section */}
                            <div className="mb-10">
                                <h3 className="text-lg font-semibold text-green-700 mb-3">
                                    Waste Reports
                                </h3>
                                {reports.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No reports found.</p>
                                ) : (
                                    <table className="w-full border border-gray-200 text-left text-sm rounded-lg">
                                        <thead className="bg-green-600 text-white">
                                            <tr>
                                                <th className="p-3">Image</th>
                                                <th className="p-3">Location</th>
                                                <th className="p-3">Weight</th>
                                                <th className="p-3">Emission</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((r) => (
                                                <tr
                                                    key={r._id}
                                                    className="border-t hover:bg-gray-50 transition"
                                                >
                                                    <td className="p-3">
                                                        <img
                                                            src={`https://swm-backend.onrender.com${r.imageUrl}`}
                                                            alt="Waste"
                                                            className="w-16 h-16 object-cover rounded-lg border"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <a
                                                            href={`https://www.google.com/maps?q=${r.pickupLocation.lat},${r.pickupLocation.lng}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-blue-600 underline text-sm"
                                                        >
                                                            View on Map
                                                        </a>
                                                    </td>
                                                    <td className="p-3">{r.estimatedWeight || "-"}</td>
                                                    <td className="p-3">{r.carbonEmission || "-"}</td>
                                                    <td className="p-3">
                                                        {r.status === "Verified" ? (
                                                            <span className="text-green-600 font-semibold">
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <select
                                                                value={r.status}
                                                                onChange={(e) =>
                                                                    updateWasteStatus(
                                                                        r._id,
                                                                        e.target.value,
                                                                        selectedUser._id
                                                                    )
                                                                }
                                                                className="border rounded-lg px-2 py-1 text-sm"
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Verified">Verify</option>
                                                            </select>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Pickup Schedules Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                                    Scheduled Pickups
                                </h3>
                                {pickups.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No pickups found.</p>
                                ) : (
                                    <table className="w-full border border-gray-200 text-left text-sm rounded-lg">
                                        <thead className="bg-blue-600 text-white">
                                            <tr>
                                                <th className="p-3">Collection Center</th>
                                                <th className="p-3">Traffic</th>
                                                <th className="p-3">Date</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pickups.map((p) => (
                                                <tr
                                                    key={p._id}
                                                    className="border-t hover:bg-gray-50 transition"
                                                >
                                                    <td className="p-3">{p.collectionCenter}</td>
                                                    <td className="p-3">{p.trafficStatus}</td>
                                                    <td className="p-3">
                                                        {new Date(p.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <select
                                                            value={p.status}
                                                            onChange={(e) =>
                                                                updatePickupStatus(
                                                                    p._id,
                                                                    e.target.value,
                                                                    selectedUser._id
                                                                )
                                                            }
                                                            className="border rounded-lg px-2 py-1 text-sm"
                                                        >
                                                            <option value="Requested">Requested</option>
                                                            <option value="Inbound to Collect">
                                                                Inbound to Collect
                                                            </option>
                                                            <option value="Collected">Collected</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
