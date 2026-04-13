import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YTPreview from "./pages/YTPreview";
import Login from "./components/Login";

export default function App() {
    const location = useLocation();
    const isPreviewRoute = location.pathname === "/preview";

    return (
        <>
            {!isPreviewRoute && <LenisScroll />}
            {!isPreviewRoute && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate/>} />
                <Route path="/generate/:id" element={<Generate/>} />
                <Route path="/my-generation" element={<MyGeneration/>} />
                <Route path="/preview" element={<YTPreview/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
            {!isPreviewRoute && <Footer />}
        </>
    );
}
