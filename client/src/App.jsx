import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AttackAnalysis from "./pages/AttackAnalysis";
import GeoMap from "./pages/GeoMap";
import URLChecker from "./pages/URLChecker";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/attack-analysis" element={<AttackAnalysis />} />
      <Route path="/geo" element={<GeoMap />} />
      <Route path="/url-check" element={<URLChecker />} />
    </Routes>
  </BrowserRouter>
);

export default App;
