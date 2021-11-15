const pantryApp = {};
/////////////////// VARIABLES /////////////////////////
pantryApp.apiKey = "914e2817b56c4dc48483a6c50bb886ac";
pantryApp.searchForm = document.querySelector("form");
pantryApp.modalContainer = document.getElementById("modal_container");
pantryApp.modalInfo = document.getElementById("modal");
pantryApp.listOfRecipes = document.querySelector(".card-results");
pantryApp.loadingSpinner = document.querySelectorAll(".loading");

pantryApp.init = () => {
  // code to kich off app goes here
  pantryApp.submitForm();
  pantryApp.typewriterFeature();
  pantryApp.slideshowFeature();
  pantryApp.scrollToTop();
};

pantryApp.slideshowFeature = () => {
  //////////////  SLIDESHOW FEATURE /////////////////

  // Slideshow feature
  // .fade effects are added in CSS

  //Declare variable slideIndex and assign it a value of 0
  let slideIndex = 0;
  showSlides();
  // Declare showSlides function
  function showSlides() {
    let i;
    // Select all elements with class mySlides
    let slides = document.getElementsByClassName("mySlides");
    // Create for each loop to iterate through items & set display to none.
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    //To show img:
    // Add increment operator ++ to slideIndex [make it add one to the operand slideIndex] in order to return a value for the statement
    slideIndex++;
    // if condition passes the parameter, slideIndex = 1
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    // Display the slide at current slideIndex
    slides[slideIndex - 1].style.display = "block";
    // Call showSlides function and apply setTimeout method to change the image every 5 seconds
    setTimeout(showSlides, 5000);
  }
};

///////////TYPERWRITER FEATURE/////////////////
pantryApp.typewriterFeature = () => {
  const textDisplay = document.getElementById("text");
  const phrases = ["We got a recipe for that..."];
  let i = 0;
  let j = 0;
  let currentPhrase = [];
  let isDeleting = false;
  let isEnd = false;

  function loop() {
    isEnd = false;
    textDisplay.innerHTML = currentPhrase.join("");

    if (i < phrases.length) {
      if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
        textDisplay.innerHTML = currentPhrase.join("");
      }

      if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop(phrases[i][j]);
        j--;
        textDisplay.innerHTML = currentPhrase.join("");
      }

      if (j == phrases[i].length) {
        isEnd = true;
        isDeleting = true;
      }

      if (isDeleting && j === 0) {
        currentPhrase = [];
        isDeleting = false;
        i++;
        if (i === phrases.length) {
          i = 0;
        }
      }
    }
    const spedUp = Math.random() * (80 - 50) + 80;
    const normalSpeed = Math.random() * (300 - 200) + 200;
    const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
    setTimeout(loop, time);
  }
  loop();
};
//inspired by Ania Kubow's code-along 
// fill out 3-5 ingredient inputs

// Get food value out of form
pantryApp.submitForm = () => {
  // select all input ingredients
  pantryApp.ingredients = document.querySelectorAll(".input");

  // When submitted, put all input ingredients in an array and use that array as an argument to get recipe from an api
  pantryApp.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // scroll down to the rended results
    window.scrollTo(0, 1850);
    // create an empty array
    const ingredients = [];
    // loop through all the input
    pantryApp.ingredients.forEach((n, i) => {
      // put focus on the first input. Indicates user to input new ingredients
      if (i === 0) {
        n.focus();
      }
      // pushes inputted value (ingredient) to the ingredients array
      ingredients.push(n.value);
      // clears the input when form is submitted
      n.value = "";
    });

    // use ingredients array as an argument for a function that grabs recipes from an api
    pantryApp.getRecipeApi(ingredients);
  });
};

pantryApp.renderError = (error, component) => {
  // create a div that will hold all the information and be shown to the user, add class name to the div
  if (component === "card") {
    const noRecipe = document.createElement("div");
    noRecipe.classList.add("card");
    const noRecipeInfoText = document.createElement("h2");
    noRecipeInfoText.textContent = error;
    noRecipe.appendChild(noRecipeInfoText);
    pantryApp.listOfRecipes.appendChild(noRecipe);
    pantryApp.hideLoadingSpinner(0);
  }
  if (component === "modal") {
    pantryApp.modalInfo.style.opacity = 1;
    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = error;
    pantryApp.modalInfo.appendChild(recipeTitle);
    pantryApp.hideLoadingSpinner(1);
  }
};

// an async function that gets recipes from an api based on inputted ingredients
pantryApp.getRecipeApi = async (ingredientsArray) => {
  try {
    // make sure div is empty to put new recipe html and no overlap
    pantryApp.listOfRecipes.innerHTML = "";
    // a function that shows loading spinner while waiting for data
    pantryApp.showLoadingSpinner(0);
    // destructure ingredientsArray to up to 5 different variables
    const [a, b, c, d, e] = ingredientsArray;

    // grab the url and parameters of the api
    const url = new URL(
      "https://api.spoonacular.com/recipes/findByIngredients"
    );
    url.search = new URLSearchParams({
      apiKey: pantryApp.apiKey,
      ingredients: `${a},+${b},+${b},+${b},+${b}`,
      number: 10000,
      ignorePantry: true,
      ranking: 1,
    });
    // await fetch api
    const response = await fetch(url);
    // if there is an error when getting the data from the api, write a message
    if (!response.ok) {
      throw new Error(
        `Something Went Wrong! Recipe not found (${response.status})`
      );
    }

    // await the json file to convert to an object
    const data = await response.json();
    // data received from api is filtered to only have 2 or less missing ingredients
    const recipesWithTwoOrLessMissingIngredient = data.filter((n) => {
      return n.missedIngredientCount <= 2;
    });
    // if the array is empty call the function that renders errors for the user
    if (recipesWithTwoOrLessMissingIngredient.length === 0) {
      pantryApp.renderError(
        "No Recipe Found! Try Increasing The Ingredients",
        "card"
      );
    }

    // filtered data plugged in a function that renders a collection of divs that has information on each recipe
    pantryApp.cardRecipe(recipesWithTwoOrLessMissingIngredient);

    // a function that hides loading spinner when data is retrieved
    pantryApp.hideLoadingSpinner(0);

    // catch any errors and put it as an argument for the function that renders error message for the user
  } catch (error) {
    pantryApp.renderError(error.message, "card");
  }
};

// a function that uses data from the api to make a div that has information on available recipes
pantryApp.cardRecipe = (results) => {
  // looping through results array to grab information from each object in the array
  results.forEach((result) => {
    // create a div that will hold all the information and be shown to the user
    const recipe = document.createElement("div");
    //add class name to the div
    recipe.classList.add("card");
    const recipeImg = document.createElement("img");
    recipeImg.src = result.image;
    recipeImg.alt = result.title;
    const recipeText = document.createElement("div");
    recipeText.classList.add("recipeText");
    const recipeTitle = document.createElement("h2");
    recipeTitle.textContent = result.title;
    recipeText.appendChild(recipeTitle);
    // a function that grabs usedIngredient, unusedIngredient, or missingIngredient to be added to the div
    pantryApp.missingUsedOrUnusedIngredients(
      result.usedIngredients,
      recipeText,
      "Ingredients found:"
    );
    pantryApp.missingUsedOrUnusedIngredients(
      result.missedIngredients,
      recipeText,
      "Missing Ingredients:"
    );
    // create a button element to be added to the div
    const buttonlinkWebsite = document.createElement("button");
    // put text content to let users know what button is for
    buttonlinkWebsite.textContent = "Try this recipe!";
    // add an event listener so when clicked, a function is called to render extra info using result id
    buttonlinkWebsite.addEventListener("click", () => {
      pantryApp.getAdditionalRecipeInfoApi(result.id);
      // show modalContainer and modal that holds extra information
      pantryApp.modalContainer.classList.add("show");
    });
    // put the button in the recipeText div
    recipeText.appendChild(buttonlinkWebsite);
    // put recipeImg inside recipe div 1st
    recipe.appendChild(recipeImg);
    // put recipeText div inside recipe div
    recipe.appendChild(recipeText);
    // now put the div with all its information inside listOfRecipe section to show to users all the recipes
    pantryApp.listOfRecipes.appendChild(recipe);
  });
};

// a function that grabs usedIngredient, unusedIngredient, or missingIngredient to be added to the div
// and also the created div
// and finally an appropriate title if its missing, used, or unused ingredient
pantryApp.missingUsedOrUnusedIngredients = (data, div, listTitle) => {
  // make a new array that holds missing, used, or unused ingredients
  const ingredients = data.map((ingredient) => {
    return ingredient.name;
  });
  // create a title, add the appropriate title (ex: Missed Ingredient), put title in the div
  const title = document.createElement("p");
  title.textContent = listTitle;
  div.appendChild(title);
  // loop through new array
  ingredients.forEach((ingredient) => {
    // create a list item, add the ingredient in it, and put the list item in the div
    const listItem = document.createElement("li");
    listItem.textContent = ingredient;
    div.appendChild(listItem);
  });
};

// An async function that gets more information from a recipe id
pantryApp.getAdditionalRecipeInfoApi = async (result) => {
  try {
    // show modalContainer that will hold the modal with extra information
    pantryApp.modalContainer.classList.add("show");
    // a function that shows loading spinner while waiting for data
    pantryApp.showLoadingSpinner(1);
    // make an url variable that concats website api url with its parameters, fetch that url, and get an object data from its json
    const url = `https://api.spoonacular.com/recipes/${result}/information?apiKey=${pantryApp.apiKey}&includeNutrition=true`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Something Went Wrong! Instructions not found (${response.status})`
      );
    }
    const data = await response.json();
    // plug in the data to a function that renders modal with extra information for the user to see
    pantryApp.displayModalRecipeInformation(data);
    // a function that hides loading spinner when data is retrieved
    pantryApp.hideLoadingSpinner(1);
  } catch (error) {
    pantryApp.renderError(error.message, "modal");
  }
};

// a function that displays a modal which holds all the extra information for the recipe the user clicked on
pantryApp.displayModalRecipeInformation = (recipeInfo) => {
  // show modal by putting its opacity from 0 to 1
  pantryApp.modalInfo.style.opacity = 1;
  // make a button that closes the modal
  const closeModalButton = document.createElement("button");
  // add font awesome icon inside button html
  closeModalButton.innerHTML = `<i class="fas fa-times fa-3x"></i>`;
  // add closeButton class to the button to give it style
  closeModalButton.classList.add("closeButton");
  // add event listener so when it is clicked, the function closeModal is called which closes the modal
  closeModalButton.addEventListener("click", pantryApp.closeModal);

  // make a recipeTitle inside modal, which is the title you get from extra information api
  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = recipeInfo.title;

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

  instructions.forEach((step) => {
    const recipeStep = document.createElement("li");
    recipeStep.textContent = step.step;
    recipeSteps.appendChild(recipeStep);
  });

  // make a div and add a recipeInfo class name to it.
  const recipeOtherInfos = document.createElement("div");
  recipeOtherInfos.classList.add("recipeInfos");
  recipeOtherInfos.innerHTML = `<p>Ready in <span>${recipeInfo.readyInMinutes}</span> minutes</p>
    <p><span>${recipeInfo.servings}</span> servings</p>
    <a href="${recipeInfo.sourceUrl}" target="_blank">Recipe Website</a>`;

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

pantryApp.scrollToTop = () => {
  const toTop = document.querySelector(".toTop");
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 1850) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  });
};

pantryApp.init();
