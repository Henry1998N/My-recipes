const express = require("express");
const router = express.Router();
const axios = require("axios");
const favourites = { favouritesArr: [] };
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
      let isExist = favourites.favouritesArr.some(
        (f) => f.mealId === recipe.mealId
      );

      if (!isExist) {
        favourites.favouritesArr.push(recipe);

        res.status(201).send({ ok: `created` }).end();
        return;
      } else {
        res.status(409).send({ error: `recipe already exists` }).end();
        return;
      }
    });
});
router.get("/recipes/favourite", (req, res) => {
  console.log(favourites);
  res.send(favourites);
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
      whichDataToSend(queryString, res, filterdArr);
    });
});

router.delete("/recipes/favourite/:id", (req, res) => {
  let recipeId = req.params.id;
  let indexToDelete = -1;
  console.log(favourites.favouritesArr);
  for (let index in favourites.favouritesArr) {
    let arr = favourites.favouritesArr;
    if (arr[index].mealId === recipeId) {
      indexToDelete = index;
    }
  }
  if (indexToDelete != -1) {
    favourites.favouritesArr.splice(indexToDelete, 1);
    res.status(204).end();
    return;
  } else {
    res.status(409).end();
    return;
  }
});

module.exports = router;
