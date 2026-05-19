export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "liguria-gradient":
          "linear-gradient(135deg, rgba(8,47,73,1) 0%, rgba(12,74,110,1) 45%, rgba(14,116,144,1) 100%)",
      },
    },
  },
  plugins: [],
};
