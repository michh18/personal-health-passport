import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClinicalNotesPage from "./pages/ClinicalNotesPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<ClinicalNotesPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
