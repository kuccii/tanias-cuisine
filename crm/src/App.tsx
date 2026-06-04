import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Assets from "./pages/Assets";
import Review from "./pages/Review";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/review" element={<Review />} />
        <Route path="/calendar" element={<div>Calendar</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
