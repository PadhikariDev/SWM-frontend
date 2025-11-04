import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
