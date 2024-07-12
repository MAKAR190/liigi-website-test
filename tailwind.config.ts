import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/index.html",
  ],
  theme: {
    screens: {
      'sm': '320px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1440px',
      'xxl':'1920px'

    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: `var(--primary-color)`,
        secondary: `var(--secondary-color)`,
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['group-hover'],
      textColor: ['group-hover'],
      bottom: ['group-hover'],
      opacity: ['group-hover'],

    },
  },
};
export default config;
