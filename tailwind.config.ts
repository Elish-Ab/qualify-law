import type { Config } from "tailwindcss"
import animatePlugin from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/components/ui/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [animatePlugin],
} satisfies Config
