// const textDisplay = document.getElementById('text')
// const phrases = ['We have a recipe for that...', 'Scroll down to get your recipe!']
// let i = 0
// let j = 0
// let currentPhrase = []
// let isDeleting = false
// let isEnd = false

// function loop() {
//     isEnd = false
//     textDisplay.innerHTML = currentPhrase.join('')
   
//     if (i < phrases.length) {

//         if (!isDeleting && j <= phrases[i].length) {
//             currentPhrase.push(phrases[i][j])
//             j++
//             textDisplay.innerHTML = currentPhrase.join('')
//         }

//         if (isDeleting && j <= phrases[i].length) {
//             currentPhrase.pop(phrases[i][j])
//             j--
//             textDisplay.innerHTML = currentPhrase.join('')
//         }

//         if (j == phrases[i].length) {
//             isEnd = true
//             isDeleting = true
//         }

//         if (isDeleting && j === 0) {
//             currentPhrase = []
//             isDeleting = false
//             i++
//             if (i === phrases.length) {
//                 i = 0
//             }
//         }
//     }
//     const spedUp = Math.random() * (80 - 50) + 50
//     const normalSpeed = Math.random() * (300 - 200) + 200
//     const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed
//     setTimeout(loop, time)
// }


// const slideIndex = 0;
// showSlides();

// function showSlides() {
//     let = i;
//     const slides = document.getElementsByClassName("mySlides");

//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }

//     slideIndex++;
//     if (slideIndex > slides.length) { slideIndex = 1 }
//     slides[slideIndex - 1].style.display = "block";
//     setTimeout(showSlides, 5000); // Change image every 2 seconds
// }

const apiKey= '529788d8ad06402481e1a03285211f00';
const searchForm = document.querySelector("form");
const listOfRecipes = document.querySelector(".search-results");

// fill out 3-5 ingredient inputs
const ingredient1 = document.querySelector(".ingredient1");
const ingredient2 = document.querySelector(".ingredient2");
const ingredient3 = document.querySelector(".ingredient3");
const ingredient4 = document.querySelector(".ingredient4");
const ingredient5 = document.querySelector(".ingredient5");

// Get food value out of form
searchForm.addEventListener("submit", (e) => {
e.preventDefault();

findRecipes(
ingredient1.value,
ingredient2.value,
ingredient3.value,
ingredient4.value,
ingredient5.value
);
});
// use value to fetch api
const findRecipes = async (a, b, c, d, e) => { 
const baseURL = ` https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${a},+${b},+${c},+${d},+${e}&number=1000`;
const response = await fetch(baseURL);
const data = await response.json();

const results = data.filter((n) => {
return n.missedIngredientCount <= 2;
});
console.log(results);

// availablerecipes(results);
};
//render results in the dom
// const availablerecipes = (results) => {
// results.forEach((result) => {
// const recipe = document.createElement("div");
// // add a link to recipe website in each recipe with an image
// recipeWebsiteLink(result, recipe);
// listOfRecipes.appendChild(recipe);
// });
// };

// const recipeWebsiteLink = async (result, dish) => {
// const baseURL = `https://api.spoonacular.com/recipes/${result.id}/information?apiKey=43e5c6f82762450d8b2df5e84351074e`;
// const response = await fetch(baseURL);
// const data = await response.json();
// console.log(data);
// dish.innerHTML = `<div>
// <a href=${data.sourceUrl} target="_blank"> <img src="${result.image}" alt="${result.title}"></a>
// </div>`;
// };




var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 5000); // Change image every 2 seconds
}

