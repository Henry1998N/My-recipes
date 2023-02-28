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
// let ing = [
//   { cheese: { dairy: true, gluten: true } },
//   { milk: { dairy: true, gluten: false } },
//   { bamba: { dairy: false, gluten: true } },
// ];
// gluten : true =>

const glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];
const glutenAndDairyIngredients = [
  "Cream",
  "Cheese",
  "Milk",
  "Butter",
  "Creme",
  "Ricotta",
  "Mozzarella",
  "Custard",
  "Cream Cheese",
  "Flour",
  "Bread",
  "spaghetti",
  "Biscuits",
  "Beer",
];
const getGlutenFreeDairyFree = function (dataToFilter) {
  let DairyFreeGleutenFree = [];
  for (let recipe of dataToFilter.filterdArr) {
    let isExist = false;
    for (let ingredient of recipe.ingredients) {
      for (let Ingredient of glutenAndDairyIngredients) {
        if (ingredient == Ingredient) {
          isExist = true;
        }
      }
    }
    if (!isExist) {
      DairyFreeGleutenFree.push(recipe);
    }
  }
  return { filterdArr: DairyFreeGleutenFree };
};
const getglutenFreeRecipes = function (dataToFilter) {
  let glutenFreeRecipes = [];
  for (let recipe of dataToFilter.filterdArr) {
    let isExist = false;
    for (let ingredient of recipe.ingredients) {
      for (let glutenIngredient of glutenIngredients) {
        if (ingredient == glutenIngredient) {
          isExist = true;
        }
      }
    }
    if (!isExist) {
      glutenFreeRecipes.push(recipe);
    }
  }
  return { filterdArr: glutenFreeRecipes };
};
const getDairyIngredientsFree = function (dataToFilter) {
  let dairyFreeRecipes = [];
  for (let recipe of dataToFilter.filterdArr) {
    let isExist = false;
    for (let ingredient of recipe.ingredients) {
      for (let dairyIngredient of dairyIngredients) {
        if (ingredient == dairyIngredient) {
          isExist = true;
        }
      }
    }
    if (!isExist) {
      dairyFreeRecipes.push(recipe);
    }
  }
  return { filterdArr: dairyFreeRecipes };
};
const whichCheckBoxesIsChecked = function (data) {
  if ($("#gluten").is(":checked") && $("#dairy").is(":checked")) {
    $("#gluten").prop("checked", false);
    $("#dairy").prop("checked", false);
    return getGlutenFreeDairyFree(data);
  } else if ($("#gluten").is(":checked")) {
    $("#gluten").prop("checked", false);
    return getglutenFreeRecipes(data);
  } else if ($("#dairy").is(":checked")) {
    $("#dairy").prop("checked", false);
    return getDairyIngredientsFree(data);
  } else {
    return data;
  }
};
$("#search-btn").on("click", () => {
  let ingredient = $("#ingredient-input").val();

  $.get(`/recipes/${ingredient}`).then((data) => {
    let filteredData = whichCheckBoxesIsChecked(data);
    let renderer = new Render(filteredData);
    renderer.renderRecipes();
  });
  $("#ingredient-input").val("");
});

$("#recipes-container").on("click", ".image", function () {
  alert($(this).data().id);
});
