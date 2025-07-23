/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./*.{js,jsx,ts,tsx}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
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
                primary: "#E23744",
                secondary: "#FAF3F0",
                accent: "#FF5733",
                textColor: "#2D2D2D",
                lightGray: "#F1F1F1",
                grayColor: "#8A8A8A",
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                slideMessages: {
                    "0%, 20%": { transform: "translateY(0)" },
                    "25%, 45%": { transform: "translateY(-64px)" },
                    "50%, 70%": { transform: "translateY(-128px)" },
                    "75%, 95%": { transform: "translateY(-192px)" },
                    "100%": { transform: "translateY(-256px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                slideMessages: "slideMessages 10s infinite ease-in-out",
            },
            boxShadow: {
                custom: "0 5px 15px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    
    plugins: [
        ('tailwind-scrollbar-hide'),('tailwindcssAnimate')],
};
