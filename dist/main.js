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

$("#recipes-container").on("click", ".image", function () {
  alert($(this).data().id);
});
