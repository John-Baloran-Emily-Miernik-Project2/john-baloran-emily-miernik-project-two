const pantryApp = {};

pantryApp.apiKey = "529788d8ad06402481e1a03285211f00";
pantryApp.searchForm = document.querySelector("form");
pantryApp.modalContainer = document.getElementById("modal_container");
pantryApp.modalInfo = document.getElementById("modal");
pantryApp.listOfRecipes = document.querySelector(".search-results");
pantryApp.loadingSpinner = document.querySelectorAll(".loading");

// fill out 3-5 ingredient inputs

pantryApp.init = () => {
  // code to kich off app goes here
  pantryApp.submitForm();
};
// Get food value out of form
pantryApp.submitForm = () => {
  pantryApp.ingredient1 = document.querySelector(".ingredient1");
  pantryApp.ingredient2 = document.querySelector(".ingredient2");
  pantryApp.ingredient3 = document.querySelector(".ingredient3");
  pantryApp.ingredient4 = document.querySelector(".ingredient4");
  pantryApp.ingredient5 = document.querySelector(".ingredient5");
  pantryApp.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // use ingredients input.value to fetch api
    pantryApp.findRecipes(
      pantryApp.ingredient1.value,
      pantryApp.ingredient2.value,
      pantryApp.ingredient3.value,
      pantryApp.ingredient4.value,
      pantryApp.ingredient5.value
    );
  });
};

// function that gates recipes from an api based on inputted ingredients
pantryApp.findRecipes = async (a, b, c, d, e) => {
  pantryApp.listOfRecipes.innerHTML = "";
  pantryApp.showLoadingSpinner(0);
  const baseURL = ` https://api.spoonacular.com/recipes/findByIngredients?apiKey=${pantryApp.apiKey}&ingredients=${a},+${b},+${c},+${d},+${e}&number=10000&ignorePantry=true&ranking=1`;
  const response = await fetch(baseURL);
  const data = await response.json();

  // data received from api is filtered to only have 2 or less missing ingredients
  const results = data.filter((n) => {
    return n.missedIngredientCount <= 2;
  });
  console.log(results);
  // filtered data plugged in a function that renders a collection of divs that has information on each recipe
  pantryApp.availablerecipes(results);
  pantryApp.hideLoadingSpinner(0);
};

// a function that uses data from the api to make a div that has information on available recipes
pantryApp.availablerecipes = (results) => {
  results.forEach((result, index) => {
    const recipe = document.createElement("div");
    recipe.innerHTML = `<div>
    <h2>${result.title}</h2>
    <div>
      <img src="${result.image}" alt="${result.title}" />
    </div>
  </div>`;
    pantryApp.missingUsedOrUnusedIngredients(
      result.usedIngredients,
      recipe,
      "Used Ingredient(s):"
    );
    pantryApp.missingUsedOrUnusedIngredients(
      result.unusedIngredients,
      recipe,
      "Unused Ingredient(s):"
    );
    pantryApp.missingUsedOrUnusedIngredients(
      result.missedIngredients,
      recipe,
      "Missing Ingredient(s):"
    );

    const buttonlinkWebsite = document.createElement("button");
    buttonlinkWebsite.id = "buttonlinkWebsite";
    buttonlinkWebsite.textContent = "Click to generate recipe website";
    buttonlinkWebsite.addEventListener("click", () => {
      console.log(index);

      pantryApp.recipeWebsiteLink(result.id);
      pantryApp.modalContainer.classList.add("show");
    });
    recipe.append(buttonlinkWebsite);
    pantryApp.listOfRecipes.appendChild(recipe);
  });
};

pantryApp.missingUsedOrUnusedIngredients = (data, div, listTitle) => {
  const ingredients = data.map((ingredient) => {
    return ingredient.name;
  });
  const title = document.createElement("h4");
  title.textContent = listTitle;
  div.appendChild(title);
  ingredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.textContent = ingredient;
    div.appendChild(listItem);
  });
};

pantryApp.recipeWebsiteLink = async (result) => {
  pantryApp.modalContainer.classList.add("show");
  pantryApp.showLoadingSpinner(1);
  const baseURL = `https://api.spoonacular.com/recipes/${result}/information?apiKey=${pantryApp.apiKey}&includeNutrition=true`;
  const response = await fetch(baseURL);
  const data = await response.json();
  console.log(data);
  pantryApp.displayModalRecipeInformation(data);
  pantryApp.hideLoadingSpinner(1);
};

pantryApp.displayModalRecipeInformation = (recipeInfo) => {
  pantryApp.modalInfo.style.opacity = 1;
  const closeModalButton = document.createElement("button");
  closeModalButton.innerHTML = `<i class="fas fa-times fa-3x"></i>`;
  closeModalButton.classList.add("closeButton");
  closeModalButton.addEventListener("click", pantryApp.closeModal);

  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = recipeInfo.title;

  const recipeOtherInfos = document.createElement("div");
  recipeOtherInfos.classList.add("recipeInfos");
  recipeOtherInfos.innerHTML = `
    <p>Ready in <span>${recipeInfo.readyInMinutes}</span> minutes</p>
    <p><span>${recipeInfo.servings}</span> servings</p>
   <a href="${recipeInfo.sourceUrl}" target="_blank">Recipe Website</a>`;
  if (recipeInfo.analyzedInstructions[0] === undefined) {
    const noInstructions = document.createElement("h2");
    noInstructions.classList.add("noInstructions");
    noInstructions.textContent =
      "Sorry there are no instructions here :( Check the website for the instructions!";
    pantryApp.modalInfo.appendChild(closeModalButton);
    pantryApp.modalInfo.appendChild(recipeTitle);
    pantryApp.modalInfo.appendChild(noInstructions);
    pantryApp.modalInfo.appendChild(recipeOtherInfos);
    return;
  }
  const instructions = recipeInfo.analyzedInstructions[0].steps;
  const recipeSteps = document.createElement("ol");
  console.log(instructions);

  instructions.forEach((step) => {
    const recipeStep = document.createElement("li");
    recipeStep.textContent = step.step;
    recipeSteps.appendChild(recipeStep);
  });
  pantryApp.modalInfo.appendChild(closeModalButton);
  pantryApp.modalInfo.appendChild(recipeTitle);

  pantryApp.modalInfo.appendChild(recipeSteps);
  pantryApp.modalInfo.appendChild(recipeOtherInfos);
};

pantryApp.closeModal = () => {
  pantryApp.modalContainer.classList.remove("show");
  pantryApp.modalInfo.style.opacity = 0;
  pantryApp.modalInfo.innerHTML = "";
};

pantryApp.showLoadingSpinner = (index) => {
  pantryApp.loadingSpinner[index].classList.add("show");
};

pantryApp.hideLoadingSpinner = (index) => {
  pantryApp.loadingSpinner[index].classList.remove("show");
};

pantryApp.modalContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-container")) {
    pantryApp.closeModal();
  }
});

pantryApp.init();
