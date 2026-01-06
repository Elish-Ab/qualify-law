"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Menu, X, Droplets, ShieldCheck, Flame } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#5A1FCC] font-inter">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#5A1FCC] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              QC
            </div>
            <span className="text-lg font-bold tracking-tight">
              Qwalify Client Portal
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-[#5A1FCC]/70 transition">
              Solutions
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-[#5A1FCC]/70 transition"
            >
              How It Works
            </Link>
            <Link href="#contact" className="hover:text-[#5A1FCC]/70 transition">
              Contact
            </Link>
            <Link href="/leads">
              <Button
                size="sm"
                className="rounded-full px-5 bg-[#5A1FCC] hover:bg-[#924bff] text-white shadow-md"
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
          <div className="md:hidden bg-white border-t border-[#5A1FCC]/10 shadow-sm animate-fade-in-down">
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
                <Button className="w-full rounded-full bg-[#5A1FCC] text-white">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-36 pb-28 text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#5A1FCC]/10 opacity-70" />
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] text-[#5A1FCC] mb-4">
            Plumbing & HVAC · Client Access
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4 text-[#5A1FCC]">
            Qwalify Client Portal for Plumbing & HVAC Pros
          </h1>
          <p className="text-lg text-[#5A1FCC]/80 max-w-2xl mx-auto mb-8">
            Give homeowners and facility managers a clean, branded workspace to
            request repairs, track service crews, and review maintenance plans
            without endless phone calls.
          </p>
          <Link href="/leads">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-[#5A1FCC] hover:bg-[#924bff] transition-transform text-white font-semibold shadow-lg"
            >
              Enter Client Portal <ArrowRight className="ml-2 w-5 h-5" />
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
            icon: <Droplets className="w-10 h-10 text-[#5A1FCC]" />,
            title: "Live Service Visibility",
            desc: "Share arrival windows, technician bios, and completion notes for every plumbing or HVAC call.",
          },
          {
            icon: <Flame className="w-10 h-10 text-[#5A1FCC]" />,
            title: "Guided Repair Intake",
            desc: "Collect photos, asset details, and warranty questions through branded walkthroughs.",
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-[#5A1FCC]" />,
            title: "Service Agreements & History",
            desc: "Store maintenance plans, invoices, and inspection reports in a secure, always-on portal.",
          },
        ].map((f, i) => (
          <Card
            key={i}
            className="p-6 text-center border border-[#5A1FCC]/20 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 bg-white rounded-3xl"
          >
            <CardContent>
              <div className="flex flex-col items-center gap-3 mb-4">
                {f.icon}
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="text-[#5A1FCC]/80 text-sm leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#5A1FCC] mb-4">
            How Qwalify Streamlines Plumbing & HVAC Service
          </h2>
          <p className="text-[#5A1FCC]/80 max-w-2xl mx-auto mb-12">
            Mirror your truck wrap and field professionalism inside a digital
            experience that keeps dispatch, technicians, and clients in sync.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                step: "01",
                title: "Capture Every Service Enquiry",
                desc: "Share the portal from your site, invoices, or QR stickers so customers log issues instantly.",
              },
              {
                step: "02",
                title: "Qwalify & Route Faster",
                desc: "Auto-prioritize emergencies, warranty repairs, or seasonal tune-ups for the right crew.",
              },
              {
                step: "03",
                title: "Brief Techs & Clients",
                desc: "Send dynamic job cards, quote approvals, and follow-up reminders automatically.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 border border-[#5A1FCC]/20 rounded-2xl shadow-sm bg-white"
              >
                <div className="w-12 h-12 rounded-full bg-[#5A1FCC]/10 text-[#5A1FCC] font-semibold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#5A1FCC]">
                  {item.title}
                </h3>
                <p className="text-[#5A1FCC]/80 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link href="/leads">
              <Button className="rounded-full px-8 py-5 bg-[#5A1FCC] text-white shadow-lg hover:bg-[#924bff]">
                See the Intake Workspace <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#5A1FCC] text-white text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Offer a Premium Plumbing & HVAC Client Portal
        </h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Turn service calls into guided experiences—capture diagnostics, keep
          customers updated, and close maintenance plans faster.
        </p>
        <Link href="/leads">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-[#5A1FCC] hover:bg-white/90 rounded-full px-8 shadow-md font-medium"
          >
            Schedule a Demo <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="py-10 text-center text-sm text-[#5A1FCC]/70 bg-white border-t border-[#5A1FCC]/10"
      >
        <p>
          © {new Date().getFullYear()} Qwalify Client Portal · Plumbing & HVAC
          ready
        </p>
      </footer>
    </main>
  );
}
