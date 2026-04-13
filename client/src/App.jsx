import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AttackAnalysis from "./pages/AttackAnalysis";
import GeoMap from "./pages/GeoMap";
import URLChecker from "./pages/URLChecker";
import EmailAnalyzer from "./pages/EmailAnalyzer";
import QRScanner from "./pages/QRScanner";
import PhishingQuiz from "./pages/PhishingQuiz";
import AIBox from "./components/AIBox";
import LiveAlerts from "./components/LiveAlerts";

const App = () => (
  <BrowserRouter>
    <LiveAlerts />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/attack-analysis" element={<AttackAnalysis />} />
      <Route path="/geo" element={<GeoMap />} />
      <Route path="/url-check" element={<URLChecker />} />
      <Route path="/email-analyzer" element={<EmailAnalyzer />} />
      <Route path="/qr-scanner" element={<QRScanner />} />
      <Route path="/quiz" element={<PhishingQuiz />} />
    </Routes>
    <AIBox />
  </BrowserRouter>
);

export default App;
