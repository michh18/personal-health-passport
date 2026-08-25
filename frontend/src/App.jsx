import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClinicalNotesPage from "./pages/ClinicalNotesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/upload" element={<ClinicalNotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
