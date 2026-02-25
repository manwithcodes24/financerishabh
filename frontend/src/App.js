import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage";
import MarketPage from "@/pages/MarketPage";
import AdminPage from "@/pages/AdminPage";
import Navbar from "@/components/Navbar";

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#030014' }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0F0518',
            border: '1px solid rgba(127, 0, 255, 0.3)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
