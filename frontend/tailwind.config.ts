import type { Config } from "tailwindcss";

/**
 * Design tokens ported from the "Epicurean Modern" design system
 * (Material 3 token set adapted for Tailwind).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#b41f00",
        "on-primary": "#ffffff",
        "primary-container": "#d93717",
        "on-primary-container": "#fffbff",
        "primary-fixed": "#ffdad3",
        "primary-fixed-dim": "#ffb4a4",
        "on-primary-fixed": "#3e0500",
        "on-primary-fixed-variant": "#8d1600",
        "inverse-primary": "#ffb4a4",
        "surface-tint": "#b82000",

        secondary: "#5f5e5e",
        "on-secondary": "#ffffff",
        "secondary-container": "#e5e2e1",
        "on-secondary-container": "#656464",
        "secondary-fixed": "#e5e2e1",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#474646",

        tertiary: "#5a5c60",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#737479",
        "on-tertiary-container": "#fdfcff",
        "tertiary-fixed": "#e2e2e7",
        "tertiary-fixed-dim": "#c6c6cb",
        "on-tertiary-fixed": "#1a1c1f",
        "on-tertiary-fixed-variant": "#45474b",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        background: "#fbf9fc",
        "on-background": "#1b1b1e",
        surface: "#fbf9fc",
        "on-surface": "#1b1b1e",
        "on-surface-variant": "#5b403a",
        "surface-variant": "#e3e2e5",
        "surface-dim": "#dbd9dd",
        "surface-bright": "#fbf9fc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f6",
        "surface-container": "#efedf0",
        "surface-container-high": "#e9e7eb",
        "surface-container-highest": "#e3e2e5",
        "inverse-surface": "#303033",
        "inverse-on-surface": "#f2f0f3",
        outline: "#907069",
        "outline-variant": "#e4beb6",

        whatsapp: "#25D366",
        "whatsapp-dark": "#128C7E",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        "container-max": "1280px",
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        gutter: "24px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        // Aliases so the design's font-* utility classes resolve (all Inter).
        "display-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-lg-mobile": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-sm": ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["17px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
      },
      boxShadow: {
        "elevation-1": "0px 4px 20px rgba(0,0,0,0.04)",
        "elevation-2": "0px 8px 24px rgba(0,0,0,0.08)",
        "cart-bar": "0px 8px 32px rgba(180,31,0,0.4)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
