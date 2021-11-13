
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 5000); // Change image every 2 seconds
}





const textDisplay = document.getElementById('text')
const phrases = ['string', 'more strings', 'never ending strings']
let i = 0
let j = 0
let currentPhrase = []
let isDeleting = false
let isEnd = false

function loop() {
    isEnd = false
    textDisplay.innerHTML = currentPhrase.join('')

    if (i < phrases.length) {

        if (!isDeleting && j <= phrases[i].length) {
            currentPhrase.push(phrases[i][j])
            j++
            textDisplay.innerHTML = currentPhrase.join('')
        }

        if (isDeleting && j <= phrases[i].length) {
            currentPhrase.pop(phrases[i][j])
            j--
            textDisplay.innerHTML = currentPhrase.join('')
        }

        if (j == phrases[i].length) {
            isEnd = true
            isDeleting = true
        }

        if (isDeleting && j === 0) {
            currentPhrase = []
            isDeleting = false
            i++
            if (i === phrases.length) {
                i = 0
            }
        }
    }
    const spedUp = Math.random() * (80 - 50) + 50
    const normalSpeed = Math.random() * (300 - 200) + 200
    const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed
    setTimeout(loop, time)
}

loop()








/////////////API/////////////
const apiKey = '529788d8ad06402481e1a03285211f00';
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

