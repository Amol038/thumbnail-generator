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
import ProtectedRoute from "./components/ProtectedRoute";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import SitePage from "./pages/SitePage";

export default function App() {
    const location = useLocation();
    const isPreviewRoute = location.pathname === "/preview";

    return (
        <>
            {!isPreviewRoute && <LenisScroll />}
            {!isPreviewRoute && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<ProtectedRoute><Generate/></ProtectedRoute>} />
                <Route path="/generate/:id" element={<ProtectedRoute><Generate/></ProtectedRoute>} />
                <Route path="/my-generation" element={<ProtectedRoute><MyGeneration/></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
                <Route path="/contact" element={<ContactPage/>} />
                <Route path="/support" element={<SitePage pageKey="support" />} />
                <Route path="/pricing" element={<SitePage pageKey="pricing" />} />
                <Route path="/affiliate" element={<SitePage pageKey="affiliate" />} />
                <Route path="/resources" element={<SitePage pageKey="resources" />} />
                <Route path="/company" element={<SitePage pageKey="company" />} />
                <Route path="/blogs" element={<SitePage pageKey="blogs" />} />
                <Route path="/community" element={<SitePage pageKey="community" />} />
                <Route path="/careers" element={<SitePage pageKey="careers" />} />
                <Route path="/about" element={<SitePage pageKey="about" />} />
                <Route path="/legal" element={<SitePage pageKey="legal" />} />
                <Route path="/privacy" element={<SitePage pageKey="privacy" />} />
                <Route path="/terms" element={<SitePage pageKey="terms" />} />
                <Route path="/preview" element={<YTPreview/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
            {!isPreviewRoute && <Footer />}
        </>
    );
}
