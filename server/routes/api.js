const express = require("express");
const router = express.Router();
const axios = require("axios");
const consts = require("./consts");
const toLowerCaseIngredients = function (arr) {
  let arrLoweredCase = [];
  arr.forEach((r) => {
    arrLoweredCase.push(r.toLowerCase());
  });
  return arrLoweredCase;
};
const getSensitiveFreeRecipes = function (recipes, sensitiveIngredients) {
  let unSensitiveRecipes = [];

  for (let recipe of recipes) {
    let isRecipeSensitive = isSensitiveIngredients(
      recipe.ingredients,
      sensitiveIngredients
    );
    if (!isRecipeSensitive) {
      unSensitiveRecipes.push(recipe);
    }
  }
  return unSensitiveRecipes;
};
const isSensitiveIngredients = function (
  recipeIngredients,
  sensitiveIngredients
) {
  recipeIngredients = toLowerCaseIngredients(recipeIngredients);
  sensitiveIngredients = toLowerCaseIngredients(sensitiveIngredients);
  for (let ingredient of recipeIngredients) {
    for (let dairyIngredient of sensitiveIngredients) {
      if (ingredient.includes(dairyIngredient)) {
        return true;
      }
    }
  }
  return false;
};

const sendFilteredRecipes = function (queryString, res, filterdArr) {
  let glutenFree = queryString?.gluten;
  let dairyFree = queryString?.dairy;
  let limit = queryString?.limit;
  let filteredRecipes = [];
  if (glutenFree === "true") {
    filteredRecipes = getSensitiveFreeRecipes(
      filterdArr,
      consts.glutenIngredients
    );
  }

  if (dairyFree === "true") {
    filteredRecipes =
      filteredRecipes.length > 0
        ? getSensitiveFreeRecipes(filteredRecipes, consts.dairyIngredients)
        : getSensitiveFreeRecipes(filterdArr, consts.dairyIngredients);
  }
  if (filteredRecipes.length == 0) {
    res.send({ filterdArr: filterdArr.splice(limit, consts.magicNum) });
    return;
  }
  res.send({ filterdArr: filteredRecipes.splice(limit, consts.magicNum) });
};
router.post("/recipes/favourite", (req, res) => {
  /// todo : favouriteRecipes|| favourites
  let recipeId = req.body;
  axios
    .get(
      `https://recipes-goodness-elevation.herokuapp.com/recipes/id/${recipeId.mealId}`
    )
    .then((response) => {
      let recipe = {
        mealId: response.data.idMeal,
        title: response.data.title,
        href: response.data.href,
        ingredients: response.data.ingredients,
        thumbnail: response.data.thumbnail,
      };
      let isExist = consts.favourites.favouritesArr.some(
        (f) => f.mealId === recipe.mealId
      );

      if (!isExist) {
        consts.favourites.favouritesArr.push(recipe);
        res.status(201).send({ ok: `created` }).end();
        return;
      } else {
        res.status(409).send({ error: `recipe already exists` }).end();
        return;
      }
    });
});
router.get("/recipes/favourite", (req, res) => {
  res.send(consts.favourites);
});
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
      sendFilteredRecipes(queryString, res, filterdArr);
    });
});

router.delete("/recipes/favourite/:id", (req, res) => {
  let recipeId = req.params.id;
  let indexToDelete = -1;
  for (let index in consts.favourites.favouritesArr) {
    let arr = consts.favourites.favouritesArr;
    if (arr[index].mealId === recipeId) {
      indexToDelete = index;
    }
  }
  if (indexToDelete != -1) {
    consts.favourites.favouritesArr.splice(indexToDelete, 1);
    res.status(204).end();
    return;
  } else {
    res.status(409).end();
    return;
  }
});

module.exports = router;
