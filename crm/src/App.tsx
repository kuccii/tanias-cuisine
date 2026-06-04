import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

function DashboardPage() { return <div>Dashboard</div>; }
function PlannerPage() { return <div>Planner</div>; }
function AssetsPage() { return <div>Assets</div>; }
function ReviewPage() { return <div>Review</div>; }
function CalendarPage() { return <div>Calendar</div>; }

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
