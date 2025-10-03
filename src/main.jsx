import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import LandingPage from "./pages/landingpage.jsx"; // 👈 create this file

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />  {/* Landing page */}
        <Route path="/app" element={<App />} />       {/* Main app */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
