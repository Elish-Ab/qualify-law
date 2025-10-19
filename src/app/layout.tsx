import "./globals.css";
import type { Metadata } from "next";
import NextAuthSessionProvider from "./providers/session-provider";

export const metadata: Metadata = {
  title: "Qualify - Lead Intelligence Platform",
  description: "Lead Intelligence and Scoring Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap all children inside the provider */}
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
