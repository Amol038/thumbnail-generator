import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  const handlePrimaryAction = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMobileLogout = async () => {
    setIsOpen(false);
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4 backdrop-blur md:px-16 lg:px-24 xl:px-32"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <NavLink to="/">
          <img src="/logo.svg" alt="logo" className="h-8.5 w-auto" />
        </NavLink>

        <div className="hidden items-center gap-8 transition duration-500 md:flex">
          <NavLink to="/" className="transation hover:text-pink-300">
            Home
          </NavLink>
          <NavLink to="/generate" className="transation hover:text-pink-300">
            Generate
          </NavLink>
          <NavLink to="/pricing" className="transation hover:text-pink-300">
            Pricing
          </NavLink>
          <NavLink to="/contact" className="transation hover:text-pink-300">
            Contact
          </NavLink>
          <NavLink to="/my-generation">My Generations</NavLink>
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        </div>

        {!isLoading && (
          <button
            onClick={handlePrimaryAction}
            disabled={isLoggingOut}
            className="hidden rounded-full bg-pink-600 px-6 py-2.5 transition-all hover:bg-pink-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:block"
          >
            {isAuthenticated
              ? isLoggingOut
                ? "Signing out..."
                : `Logout ${user?.name.split(" ")[0] ?? ""}`.trim()
              : "Get Started"}
          </button>
        )}

        <button onClick={() => setIsOpen(true)} className="md:hidden">
          <MenuIcon size={26} className="transition active:scale-90" />
        </button>
      </motion.nav>

      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black/40 text-lg backdrop-blur transition-transform duration-400 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <NavLink onClick={() => setIsOpen(false)} to="/">
          Home
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} to="/generate">
          Generate
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} to="/pricing">
          Pricing
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} to="/contact">
          Contact
        </NavLink>
        <NavLink onClick={() => setIsOpen(false)} to="/my-generation">
          My Generations
        </NavLink>
        {!isLoading && isAuthenticated && (
          <NavLink onClick={() => setIsOpen(false)} to="/profile">
            Profile
          </NavLink>
        )}
        {!isLoading && !isAuthenticated && (
          <NavLink onClick={() => setIsOpen(false)} to="/login">
            Login
          </NavLink>
        )}
        {!isLoading && isAuthenticated && (
          <button onClick={handleMobileLogout} className="text-white">
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="flex size-10 items-center justify-center rounded-md bg-pink-600 p-1 text-white transition hover:bg-pink-700 active:ring-3 active:ring-white"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
