import { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dish: {
          primary: "#184642",
          accent: "#D4A345",
          leaf: "#9FC184",
          bg: "#FAFAFA",
        },
      },
    },
  },
  plugins: [],
};

export default config;