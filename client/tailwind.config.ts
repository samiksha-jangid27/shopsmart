import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171412",
        bone: "#f7f3ed",
        oat: "#e7ded1",
        clay: "#a66f5b",
        olive: "#676f4f",
        wine: "#693d42",
        smoke: "#78716c"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 20, 18, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
