const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.use(express.static(path.join(__dirname, "node_modules")));

app.get("/recipes/:ingredient", (req, res) => {
  let ingredient = req.params.ingredient;
  axios
    .get(
      `https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient/${ingredient}`
    )
    .then((data) => {
      let filterdArr = data.data.results.map((r) => {
        return {
          idMeal: r.idMeal,
          ingredients: r.ingredients,
          title: r.title,
          thumbnail: r.thumbnail,
          href: r.href,
        };
      });
      res.send({ filterdArr });
    });
});

app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});
