const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const PORT = 3000;
const api = require("./server/routes/api");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));

app.use(express.static(path.join(__dirname, "node_modules")));

app.use("/", api);
app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
