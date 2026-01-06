"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Menu, X, Gavel, ShieldCheck, FileText } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-stone-50 to-white text-slate-900 font-inter">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-slate-900 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              L
            </div>
            <span className="text-lg font-bold tracking-tight">
              Qualify Intake
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-amber-600 transition">
              Solutions
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-amber-600 transition"
            >
              How It Works
            </Link>
            <Link href="#contact" className="hover:text-amber-600 transition">
              Contact
            </Link>
            <Link href="/leads">
              <Button
                size="sm"
                className="rounded-full px-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 hover:brightness-110 text-white shadow-md"
              >
                Book a Demo
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
                Solutions
              </Link>
              <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/leads" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 text-white">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-40 pb-32 text-center px-6">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-white to-amber-100 animate-gradient-xy opacity-60" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 bg-clip-text text-transparent">
            Client Intake Built for Modern Law Firms
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Qualify Intake centralizes every enquiry, qualifies the matter, and
            briefs your team so attorneys reach new clients with confidence in
            minutes—not days.
          </p>
          <Link href="/leads">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 hover:scale-105 transition-transform text-white font-semibold shadow-lg"
            >
              Book a Strategy Call <ArrowRight className="ml-2 w-5 h-5" />
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
            icon: <Gavel className="w-10 h-10 text-amber-600" />,
            title: "Case-Ready Intake",
            desc: "Route enquiries to the right practice group, flag conflicts instantly, and set expectations before the consult.",
          },
          {
            icon: <FileText className="w-10 h-10 text-slate-700" />,
            title: "Guided Client Experience",
            desc: "Collect facts, documents, and signatures through white-glove digital questionnaires branded for your firm.",
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
            title: "Compliance-Ready Records",
            desc: "Generate auditable timelines, templated disclosures, and privacy controls built for regulated legal work.",
          },
        ].map((f, i) => (
          <Card
            key={i}
            className="p-6 text-center border border-slate-100 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 backdrop-blur-md bg-white/80"
          >
            <CardContent>
              <div className="flex flex-col items-center gap-3 mb-4">
                {f.icon}
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            How Qualify Elevates Intake
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            Blend the professionalism of your practice with modern automation.
            Each motion keeps attorneys, paralegals, and intake specialists
            aligned on the matters that deserve their time.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                step: "01",
                title: "Capture Every Enquiry",
                desc: "Embed branded forms on your site, referral portals, or QR signage and never miss a qualified matter again.",
              },
              {
                step: "02",
                title: "Qualify with Intelligence",
                desc: "Screen conflicts, matter value, and urgency instantly with configurable scoring aligned to your intake policy.",
              },
              {
                step: "03",
                title: "Brief the Legal Team",
                desc: "Share actionable summaries, automate welcome packets, and schedule consultations without manual back-and-forth.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 border border-slate-100 rounded-2xl shadow-sm bg-slate-50/60"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-semibold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/leads">
              <Button className="rounded-full px-8 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 text-white shadow-lg">
                See the Intake Workspace <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600 text-white text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Bring Concierge-Level Intake to Your Firm
        </h2>
        <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
          From boutique practices to multi-office firms, Qualify Intake ensures
          every potential client experiences a polished, secure, and guided
          welcome.
        </p>
        <Link href="/leads">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 shadow-md font-medium"
          >
            Schedule a Consultation <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="py-10 text-center text-sm text-slate-500 bg-white border-t"
      >
        <p>
          © {new Date().getFullYear()} Qualify Intake · Purpose-built for law firms
        </p>
      </footer>
    </main>
  );
}
