const postcssImports = require("postcss-import");
const autoPrefixer = require("autoprefixer");

module.exports = {
  parser: "postcss",
  plugins: [autoPrefixer, postcssImports()],
};
