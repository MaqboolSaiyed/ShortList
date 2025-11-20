/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#f8fafc', // Slate 50
                'bg-secondary': '#ffffff', // White
                'accent-primary': '#3b82f6', // Blue 500
                'accent-secondary': '#8b5cf6', // Violet 500
                'text-primary': '#1e293b', // Slate 800
                'text-secondary': '#64748b', // Slate 500
                'glass-border': 'rgba(0, 0, 0, 0.05)',
                'glass-bg': 'rgba(255, 255, 255, 0.8)',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
