import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Returns", href: "/#returns" },
  { label: "Plans", href: "/#schemes" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Live Market", href: "/market" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (href) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      data-testid="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#030014]/80 border-b border-white/5 shadow-[0_4px_30px_rgba(127,0,255,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#7F00FF] to-[#E056FD] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(127,0,255,0.5)] transition-shadow duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Unbounded'] font-bold text-lg text-white tracking-tight">
              Nova<span className="text-[#E056FD]">X</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href.startsWith("/#") ? "/" : link.href}
                onClick={() => handleNavClick(link.href)}
                data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                className={`text-sm font-medium transition-colors duration-200 ${
                  (location.pathname === link.href || (link.href === "/" && location.pathname === "/"))
                    ? "text-[#E056FD]"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/market"
              data-testid="nav-cta-button"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] hover:shadow-[0_0_25px_rgba(127,0,255,0.5)] transition-all duration-300 hover:scale-105"
            >
              Explore Market
            </Link>
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-[#030014]/95 border-b border-white/5"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href.startsWith("/#") ? "/" : link.href}
                  onClick={() => handleNavClick(link.href)}
                  data-testid={`mobile-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  className="block text-base text-[#A1A1AA] hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/market"
                data-testid="mobile-nav-cta"
                className="block w-full text-center px-5 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#7F00FF] to-[#E056FD] mt-2"
              >
                Explore Market
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
