import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClinicalNotesPage from "./pages/ClinicalNotesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<ClinicalNotesPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/confirm-email" element={<ConfirmEmailPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
