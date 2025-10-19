"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, BarChart3, Zap, Menu, X } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-gray-50 text-gray-900 font-inter">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              Q
            </div>
            <span className="text-lg font-bold tracking-tight">Qualify</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-blue-600 transition">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-blue-600 transition">
              How It Works
            </Link>
            <Link href="#contact" className="hover:text-blue-600 transition">
              Contact
            </Link>
            <Link href="/leads">
              <Button
                size="sm"
                className="rounded-full px-5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-md"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-sm animate-fade-in-down">
            <div className="flex flex-col p-4 space-y-3">
              <Link href="#features" onClick={() => setIsMenuOpen(false)}>
                Features
              </Link>
              <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/leads" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-40 pb-32 text-center px-6">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-indigo-100 animate-gradient-xy opacity-40" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-400 bg-clip-text text-transparent">
            From Enquiry to Conversion — In Minutes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Qualify automates how you capture, score, and nurture incoming
            leads — turning every enquiry into an opportunity faster than ever.
          </p>
          <Link href="/leads">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-105 transition-transform text-white font-semibold shadow-lg"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-8 px-6"
      >
        {[
          {
            icon: <Zap className="w-10 h-10 text-blue-600" />,
            title: "Smart Lead Scoring",
            desc: "Automatically identify high-intent leads and prioritize follow-ups with AI-assisted context.",
          },
          {
            icon: <Users className="w-10 h-10 text-indigo-600" />,
            title: "Unified Dashboard",
            desc: "Manage and track all your prospects, conversations, and conversions in one sleek interface.",
          },
          {
            icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
            title: "Actionable Insights",
            desc: "See what’s working with real-time analytics — empowering faster decisions and stronger growth.",
          },
        ].map((f, i) => (
          <Card
            key={i}
            className="p-6 text-center border-none shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 backdrop-blur-md bg-white/60"
          >
            <CardContent>
              <div className="flex flex-col items-center gap-3 mb-4">
                {f.icon}
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Automate Your Lead Flow Today
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Transform your lead pipeline into an efficient, self-running growth
          engine — and focus on closing, not chasing.
        </p>
        <Link href="/leads">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 shadow-md font-medium"
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="py-10 text-center text-sm text-gray-500 bg-white border-t"
      >
        <p>
          © {new Date().getFullYear()} Qualify Automation Platform
        </p>
      </footer>
    </main>
  );
}
