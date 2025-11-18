import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./pages/Category";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}
