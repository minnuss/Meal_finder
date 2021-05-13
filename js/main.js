const search = document.getElementById('search')
const bntSubmit = document.getElementById('submit')
const btnRandom = document.getElementById('random')
const mealsEl = document.getElementById('meals')
const resultHeading = document.querySelector('.result-heading h2')
const single_mealEl = document.getElementById('single-meal')

// url for searching through input with name of meal
const apiURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

// SEARCH MEAL AND FETCH FROM API
async function searchMeal(e) {
    e.preventDefault()

    // reset result when new search is prompt
    mealsEl.innerHTML = ''

    // clear single meal
    single_mealEl.innerHTML = ''

    // get the search term
    const term = search.value
    // console.log(term)

    // check for empty input
    if (term.trim()) {
        const res = await fetch(apiURL + term)
        const data = await res.json()
        // console.log(data)

        document.querySelector('.result-heading h2').innerText = `Search results for '${term}':`
        // function that creates meals
        createMeals(data)

    } else {
        alert('Please enter a search term')
    }
}

function createMeals(data) {
    // console.log(data)

    if (data.meals === null) {
        resultHeading.innerHTML = `
        <h2>There are not search results. Try Again!<h2>
        `
    } else {
        const mealsEl = document.getElementById('meals')

        data.meals.forEach(meal => {
            let { idMeal, strMeal, strMealThumb } = meal

            // console.log(idMeal, strMeal, strMealThumb)

            let mealEl = document.createElement('div')
            mealEl.classList.add('meal')
            const mealElHTML = `
            <img src="${strMealThumb}" alt="${strMeal}" srcset="">
            <div class="meal-info" data-mealID="${idMeal}">
                <h3>${strMeal}</h3>
            </div>
           `
            mealEl.innerHTML = mealElHTML
            mealsEl.appendChild(mealEl)
        });

    }
    // clear search text
    search.value = ''
}

// FETCH MEAL BY ID
async function getMealById(mealID) {
    // url for searching specific meal with mealID
    const fullDetailsURL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
    const res = await fetch(fullDetailsURL + mealID)
    const data = await res.json()
    // console.log(data)
    const meal = data.meals[0]

    addMealToDOM(meal)
}

// ADD MEAL TO DOM 
function addMealToDOM(meal) {
    // console.log(meal)
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            const strIngredient = `${meal[`strIngredient${i}`]}`
            const strMeasure = `${meal[`strMeasure${i}`]}`
            // console.log(strIngredient)
            // console.log(strMeasure)
            ingredients.push(`${strIngredient} - ${strMeasure}`);
            // console.log(ingredients)
        }
    }
    single_mealEl.innerHTML = `
    <h2>${meal.strMeal}</h2>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
  <div class="single-meal-info">
    ${meal.strCategory ? `<h3>${meal.strCategory}</h3>` : ''}
    ${meal.strArea ? `<h3>${meal.strArea}</h3>` : ''}
  </div>
  <div class="main">
<p>${meal.strInstructions}</p>
<h3 class="ingredients">Ingredients</h3>
<ul>
${ingredients.map(ing => `<li>${ing}</li>`).join('')}
</ul>
    `
}

// FETCH RANDOM MEAL FROM API
async function getRandomMeal() {
    mealsEl.innerHTML = ''
    if (resultHeading) {
        resultHeading.innerHTML = ''
    }

    // url for fetching random meal
    const randomURL = 'https://www.themealdb.com/api/json/v1/1/random.php'

    const res = await fetch(randomURL)
    const data = await res.json()

    const meal = data.meals[0]
    // console.log(meal)
    addMealToDOM(meal)
}

// EVENT LISTENER
bntSubmit.addEventListener('submit', searchMeal)
btnRandom.addEventListener('click', getRandomMeal)

// EACH MEAL EVENT
mealsEl.addEventListener('click', (e) => {

    if (e.target.classList.contains('meal-info')) {
        console.log(e.target.getAttribute('data-mealid'))
        const mealID = e.target.getAttribute('data-mealid')

        getMealById(mealID)
    }
})