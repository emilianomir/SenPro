/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // bkg: "var(--background)",
        // foreground: "var(--foreground)",
        // card_bkg: "var(--card_bg)",
        // textContent: "var(--textContent)",
        // border_col: "var(--border_col)",
        p1: 'rgb(var(--p1) / <alpha-value>)',
        // primary2: "var(--p2)",
      },
    }
  },
  plugins: [],
};
