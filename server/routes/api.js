const express = require("express");
const router = express.Router();
const axios = require("axios");
const glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];
const dairyIngredients = [
  "Cream",
  "Cheese",
  "Milk",
  "Butter",
  "Creme",
  "Ricotta",
  "Mozzarella",
  "Custard",
  "Cream Cheese",
];
const getglutenFreeRecipes = function (filterdArr) {
  let glutenFreeArr = [];
  for (let recipe of filterdArr) {
    let isExist = false;
    for (let ingredient of recipe.ingredients) {
      for (let glutenIngredient of glutenIngredients) {
        if (ingredient == glutenIngredient) {
          isExist = true;
        }
      }
    }
    if (!isExist) glutenFreeArr.push(recipe);
  }
  return { filterdArr: glutenFreeArr };
};
const getDairyFreeRecipes = function (filterdArr) {
  let dairyFreeArr = [];
  for (let recipe of filterdArr) {
    let isExist = false;
    for (let ingredient of recipe.ingredients) {
      for (let dairyIngredient of dairyIngredients) {
        if (ingredient == dairyIngredient) {
          isExist = true;
        }
      }
    }
    if (!isExist) dairyFreeArr.push(recipe);
  }
  return { filterdArr: dairyFreeArr };
};
const whichDataToSend = function (queryString, res, filterdArr) {
  let glutenFree = queryString?.gluten;
  let dairyFree = queryString?.dairy;
  if (glutenFree != undefined && dairyFree != undefined) {
    if (glutenFree === "true" && dairyFree === "true") {
      let filterdByDairyAndGluten = getDairyFreeRecipes(
        getglutenFreeRecipes(filterdArr).filterdArr
      );
      res.send(filterdByDairyAndGluten);
    } else res.send({ filterdArr });
  } else if (glutenFree != undefined) {
    if (glutenFree === "true") res.send(getglutenFreeRecipes(filterdArr));
    else res.send({ filterdArr });
  } else if (dairyFree != undefined) {
    if (dairyFree === "true") res.send(getDairyFreeRecipes(filterdArr));
    else res.send({ filterdArr });
  } else {
    res.send({ filterdArr });
  }
};
router.get("/recipes/:ingredient", (req, res) => {
  let ingredient = req.params.ingredient;
  let queryString = req.query;

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
      whichDataToSend(queryString, res, filterdArr);
    });
});

module.exports = router;
