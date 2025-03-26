/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  // Prevenir conflitos com PrimeVue
  important: true,
  corePlugins: {
    preflight: false, // Desabilita o reset CSS do Tailwind
  },
};
