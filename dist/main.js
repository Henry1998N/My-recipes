const whichCheckBoxesIsChecked = function () {
  let ingredient = $("#ingredient-input").val();

  if ($("#gluten").is(":checked") && $("#dairy").is(":checked")) {
    return `/recipes/${ingredient}?gluten=true&dairy=true`;
  } else if ($("#gluten").is(":checked")) {
    return `/recipes/${ingredient}?gluten=true`;
  } else if ($("#dairy").is(":checked")) {
    return `/recipes/${ingredient}?dairy=true`;
  } else {
    return `/recipes/${ingredient}`;
  }
};
$("#search-btn").on("click", () => {
  let route = whichCheckBoxesIsChecked();
  $.get(route).then((data) => {
    let renderer = new Render(data);
    renderer.renderRecipes();
  });
  $("#ingredient-input").val("");
  $("#gluten").prop("checked", false);
  $("#dairy").prop("checked", false);
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
