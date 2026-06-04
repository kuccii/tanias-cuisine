import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div style={{padding: 40, textAlign: 'center'}}><h1>Dashboard</h1><p style={{color: '#666', marginTop: 8}}>Posting System loaded successfully.</p></div>} />
      <Route path="/planner" element={<div style={{padding: 40, textAlign: 'center'}}><h1>Planner</h1></div>} />
      <Route path="/assets" element={<div style={{padding: 40, textAlign: 'center'}}><h1>Assets</h1></div>} />
      <Route path="/review" element={<div style={{padding: 40, textAlign: 'center'}}><h1>Review</h1></div>} />
      <Route path="/calendar" element={<div style={{padding: 40, textAlign: 'center'}}><h1>Calendar</h1></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
