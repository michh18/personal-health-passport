import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClinicalNotesPage from "./pages/ClinicalNotesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<ClinicalNotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
