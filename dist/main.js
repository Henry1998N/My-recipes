$("#search-btn").on("click", () => {
  let ingredient = $("#ingredient-input").val();
  $.get(`/recipes/${ingredient}`).then((data) => {
    let renderer = new Render(data);
    renderer.renderRecipes();
  });
  $("#ingredient-input").val("");
});

$("#recipes-container").on("click", ".image", function () {
  alert($(this).data().id);
});
