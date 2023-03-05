this.limit = 0;
this.ingredient = "";
const whichCheckBoxesIsChecked = function (limit, ingredient) {
  if (ingredient != "")
    if ($("#gluten").is(":checked") && $("#dairy").is(":checked")) {
      return `/recipes/${ingredient}?gluten=true&dairy=true&limit=${limit}`;
    } else if ($("#gluten").is(":checked")) {
      return `/recipes/${ingredient}?gluten=true&limit=${limit}`;
    } else if ($("#dairy").is(":checked")) {
      return `/recipes/${ingredient}?dairy=true&limit=${limit}`;
    } else {
      return `/recipes/${ingredient}?limit=${limit}`;
    }
};
$("#search-btn").on("click", () => {
  this.ingredient = $("#ingredient-input").val();

  let route = whichCheckBoxesIsChecked(this.limit, this.ingredient);
  $.get(route).then((data) => {
    let renderer = new Render(data);
    renderer.renderRecipes();
  });
  $("#ingredient-input").val("");
});
$(".paginations").on("click", "#next", () => {
  this.limit += 4;
  let route = whichCheckBoxesIsChecked(this.limit, this.ingredient);
  $.get(route).then((data) => {
    if (data.filterdArr.length > 0) {
      let renderer = new Render(data);
      renderer.renderRecipes();
    } else {
      alert("there is no more recipes");
    }
  });
  $("#ingredient-input").val("");
});
$(".paginations").on("click", "#back", () => {
  if (this.limit > 0) {
    this.limit -= 4;
  } else {
    alert("this is the first page");
  }
  let route = whichCheckBoxesIsChecked(this.limit, this.ingredient);
  $.get(route).then((data) => {
    let renderer = new Render(data);
    renderer.renderRecipes();
  });
  $("#ingredient-input").val("");
});
$("#recipes-container").on("click", ".addToFav", function () {
  let mealId = $(this).data().id;
  $.post("/recipes/favourite", { mealId: mealId })
    .then((response) => {
      alert("added new recipe to favourites");
    })
    .catch((err) => {
      alert("you already added this recipe to favourites");
    });
});

$("#recipes-container").on("click", ".image", function () {
  let ingredients = $(this).data().id;
  let ingredient = ingredients.slice(0, ingredients.indexOf(","));
  alert(ingredient);
});
const getFavouritesRecipes = function () {
  $.get("/recipes/favourite").then((data) => {
    let renderer = new Render(data);
    renderer.renderFavRecipes();
  });
};
$(".headContainer").on("click", ".fav", function () {
  getFavouritesRecipes();
});
$("#recipes-container").on("click", ".li", function () {
  favRecipeId = $(this).data().id;
  $.ajax({
    url: `/recipes/favourite/${favRecipeId}`,
    type: "DELETE",
    success: function (result) {
      alert("deleted");
      getFavouritesRecipes();
    },
  });
});
