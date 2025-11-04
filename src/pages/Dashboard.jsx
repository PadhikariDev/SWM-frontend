import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickupStatus, setPickupStatus] = useState({});
  const [greenScore, setGreenScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      try {
        const [wasteRes, pickupRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/reportWaste/${user._id}`),
          axios.get(`http://localhost:8000/api/pickup/${user._id}`),
        ]);
        setReports(wasteRes.data);
        setPickups(pickupRes.data);

        // Calculate green score
        const completedPickups = pickupRes.data.filter(
          (p) => p.status === "Completed"
        ).length;
        const totalReports = wasteRes.data.length;
        const score = totalReports * 10 + completedPickups * 20;
        setGreenScore(score);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const schedulePickup = async (reportId, report) => {
    try {
      const { pickupLocation } = report;

      const pickupData = {
        userId: user._id,
        pickupLocation: {
          lat: pickupLocation.lat,
          lng: pickupLocation.lng,
        },
        collectionCenter: "Central Waste Facility",
        trafficStatus: "Moderate",
      };

      const res = await axios.post("http://localhost:8000/api/pickup", pickupData);
      setPickupStatus((prev) => ({ ...prev, [reportId]: "Scheduled ✅" }));
      alert("Pickup scheduled successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("Error scheduling pickup:", err);
      alert("Failed to schedule pickup");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 px-6 md:px-16 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, <span className="text-green-700">{user?.fullName || "User"}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Manage your reports, pickups, and track your environmental impact.
        </p>
      </div>

      {/* Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm text-gray-500 mb-1">Waste Reports</h2>
          <p className="text-3xl font-bold text-gray-800">{reports.length}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm text-gray-500 mb-1">Scheduled Pickups</h2>
          <p className="text-3xl font-bold text-gray-800">{pickups.length}</p>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm text-gray-500 mb-1">Green Score</h2>
          <p className="text-3xl font-bold text-green-700">{greenScore}</p>
        </div>
      </div>

      {/* Waste Reports Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Waste Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">No waste reports yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="text-left py-3 px-4">Report ID</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Weight</th>
                  <th className="text-left py-3 px-4">Carbon</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t hover:bg-gray-50 transition text-sm"
                  >
                    <td className="py-3 px-4 text-gray-800">{r._id.slice(-6)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {r.pickupLocation?.lat.toFixed(2)}, {r.pickupLocation?.lng.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{r.estimatedWeight || "N/A"} kg</td>
                    <td className="py-3 px-4">{r.carbonEmission || "N/A"} CO₂</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pickup History Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup History</h2>
        {pickups.length === 0 ? (
          <p className="text-gray-500">No pickups scheduled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="text-left py-3 px-4">Pickup ID</th>
                  <th className="text-left py-3 px-4">Center</th>
                  <th className="text-left py-3 px-4">Traffic</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="py-3 px-4 text-gray-800">{p._id.slice(-6)}</td>
                    <td className="py-3 px-4">{p.collectionCenter}</td>
                    <td className="py-3 px-4 text-green-700">{p.trafficStatus}</td>
                    <td className="py-3 px-4">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : p.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Green Score Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Green Score 🌍</h2>
        <p className="text-5xl font-extrabold text-green-700 mb-2">{greenScore}</p>
        <p className="text-gray-500 mb-6">
          Great work! Keep reporting waste and scheduling pickups to increase your impact.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition cursor-pointer">
          Redeem your points 🎁
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
