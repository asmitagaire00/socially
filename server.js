const app = require("./src/app");

const PORT = process.env.PORT || 9060;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}.`);
});
