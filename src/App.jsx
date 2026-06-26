import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import TrackingPage from "./pages/TrackingPage";
import TestTrackingPage from "./pages/TestTrackingPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<TestTrackingPage />} />
      <Route path="/:orderId" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;
