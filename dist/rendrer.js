class Render {
  constructor(data) {
    this.data = data;
  }
  renderRecipes() {
    const source = $("#recipes-template").html();
    const template = Handlebars.compile(source);
    let newHTML = template({ data: this.data });
    $(".recipes-container").empty().append(newHTML);
  }
}
