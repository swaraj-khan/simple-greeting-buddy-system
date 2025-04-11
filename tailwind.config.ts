
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        draconic: {
          black: "#111111",
          orange: "#FF7B00",
          "orange-light": "#FF9D45",
          gold: "#FFD700",
          "gold-light": "#FFEB99",
        },
        purple: {
          DEFAULT: "#9b87f5",
          light: "#d6bcfa",
          dark: "#7e69ab",
          deeper: "#6e59a5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'geist': ['Geist Serif', 'serif'],
        'reckless': ['Reckless Neue', 'serif'],
        'nova-flat': ['Nova Flat', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flow-effect": {
          "0%": { boxShadow: "0 0 5px rgba(255, 123, 0, 0.5), 0 0 10px rgba(255, 123, 0, 0.2)" },
          "50%": { boxShadow: "0 0 10px rgba(255, 123, 0, 0.8), 0 0 20px rgba(255, 123, 0, 0.4)" },
          "100%": { boxShadow: "0 0 5px rgba(255, 123, 0, 0.5), 0 0 10px rgba(255, 123, 0, 0.2)" },
        },
        "text-rotate": {
          "0%, 20%": { opacity: "0", transform: "translateY(5px)" },
          "5%, 15%": { opacity: "1", transform: "translateY(0)" },
        },
        "honeycomb-glow": {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        "badge-pulse": {
          "0%": { opacity: "0.6", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "100%": { opacity: "0.6", transform: "scale(0.95)" },
        },
        "purple-glow": {
          "0%": { boxShadow: "0 0 20px 5px rgba(155, 135, 245, 0.2)" },
          "50%": { boxShadow: "0 0 40px 10px rgba(155, 135, 245, 0.4)" },
          "100%": { boxShadow: "0 0 20px 5px rgba(155, 135, 245, 0.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flow-effect": "flow-effect 3s infinite",
        "text-rotate": "text-rotate 10s infinite",
        "honeycomb-glow": "honeycomb-glow 15s ease infinite",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
        "purple-glow": "purple-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
