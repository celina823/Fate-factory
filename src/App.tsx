import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./pages/Category";
import LadderPage from "./pages/LadderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Category />} />
        <Route path="/ladder" element={<LadderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
