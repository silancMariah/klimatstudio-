import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Pass0 from "./pages/Pass0";
import Portfolio from "./pages/portfolio";
import MiniAi from "./pages/MiniAi";
import StationSim from "./pages/StationSim";
import TurtleLab from "./pages/TurtleLab";
import Gif from "./tester/gif";
import RocketWorld from "./pages/RocketWorld";


function App() {
  console.log("🌍 App is rendering!");

  return (
    <Router>
      <main className="combined-page">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pass0" element={<Pass0 />} />
          <Route path="/mini-ai" element={<MiniAi />} />
          <Route path="/station-sim" element={<StationSim />} />
          <Route path="/turtle-lab" element={<TurtleLab />} />
          <Route path ="/gif" element={<Gif />} />
          <Route path="/rocket-world" element={<RocketWorld />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
