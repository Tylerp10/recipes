const inputBar = document.querySelector(".input-bar")
const enterBtn = document.querySelector(".enter-btn")
const searchField = document.querySelector(".search-field")
const detailsContent = document.querySelector(".details-content")
const errorMessage = document.querySelector(".error-message")
const getIngredients = document.querySelector("recipe-btn")
const closeRecipe = document.querySelector(".close-recipe")


async function getRecipes() {
    let search = inputBar.value
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
        
    const response = await fetch(url)
    const recipes = await response.json()
    console.log(recipes)

    
    const mealsList = recipes.meals ? recipes.meals.map(meal => meal.strMeal) : []
    const mealImgList = recipes.meals ? recipes.meals.map(meal => meal.strMealThumb) : []
    const mealIds = recipes.meals ? recipes.meals.map(meal => meal.idMeal) : []
    
    if (search === ""){
        errorMessage.innerHTML = "Enter an ingredient..."
    } 
     else if (mealsList.length > 0){
        mealsList.forEach((meal, index) => {
                
            const mealContainer = document.createElement("div")
            mealContainer.classList.add("meal-container")
            
            const mealName = document.createElement("h3")
            mealName.classList.add("recipe-title")
            mealName.textContent = meal
            
            const mealImg = document.createElement("img")
            mealImg.src = mealImgList[index]
            
            const getRecipeBtn = document.createElement("button")
            getRecipeBtn.textContent = "Get Recipe"
            getRecipeBtn.classList.add("recipe-btn")

            // get the instructions of each recipe 
            getRecipeBtn.addEventListener('click', async (e)=>{
                const mealId = mealIds[index]
                const newUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`

                const response = await fetch(newUrl)
                const ingredients = await response.json()
                console.log(ingredients.meals[0].strYoutube)

                let recipeContent = `
                <div class="details-container">
                <div class="recipe-details">
                  <h3 class="details-name">${ingredients.meals[0].strMeal}</h3>
                  <button class="close-recipe">x</button
                  <h5 class="details-category">Category: ${ingredients.meals[0].strCategory}</h5>
                  <p class="instructions"><b>Instructions:</b> ${ingredients.meals[0].strInstructions}</p>
                  <img class="recipe-img" src=${ingredients.meals[0].strMealThumb}><br>
                    <button class="tutorial"><a href="${ingredients.meals[0].strYoutube}">Watch Tutorial</a></button>
                </div>
              </div>
                `
            detailsContent.innerHTML = recipeContent
            detailsContent.classList.add("show-recipe")
            
            })

            mealContainer.appendChild(mealName)
            mealContainer.appendChild(mealImg)
            mealContainer.appendChild(getRecipeBtn)

            searchField.appendChild(mealContainer)

            errorMessage.innerHTML = ""
        })
    }
        else {
        errorMessage.innerHTML = "No recipes found"
    }
}

document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('close-recipe')) {
        detailsContent.classList.remove("show-recipe");
    }
});

enterBtn.addEventListener('click', () => {
    getRecipes()
    inputBar.value = ''
    searchField.innerHTML = ''
})

inputBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        getRecipes()
        inputBar.value = ''
        searchField.innerHTML = ''
    }
})