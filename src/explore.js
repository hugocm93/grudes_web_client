import { useState } from "react";
import { bind } from "./utils";
import { IngredientsTable } from "./ingredients";
import { RecipesTable, RecipeDisplay } from "./recipes";

var url = "https://www.themealdb.com/api/json/v1/1/"

export function convert_to_recipe(meal)
{
    const maxIngredients = 21;
    const ingredients = [];
    for(let i = 1; i < maxIngredients; i++)
    {
        const name = meal["strIngredient" + i];
        if(name.length !== 0)
        {
            const measure = meal["strMeasure" + i].split(' ');
            let unit = ""; 
            let quantity = measure[0];
            if(measure.length == 2)
                unit = measure[1];
    
            ingredients.push({ingredient: name, quantity: quantity, unit: unit});
        }
        else
            break;
    } 

    return {name: meal.strMeal, ingredients: ingredients, instructions: meal.strInstructions};
}

export async function get_recipes_impl(name, ingredients)
{
    var url_ = url + "/search.php";

    if(name.length !== 0)
        url_ = url_ + `?${new URLSearchParams({s: name}).toString()}`;
    else
        url_ = "" 

    //ingredients.forEach((ingredient) =>
    //{
    //    if(ingredient.name.length !== 0 )
    //        url_ = url_ + `&${new URLSearchParams({ingredients: ingredient.name}).toString()}`
    //});

    return fetch(url_,
    {
        method: "get",
    })
    .then((response) => response.json())
    .then((data) =>
    {
        if(data.meals)
        {
            return data.meals.map(convert_to_recipe);
        }
        else
            return [];
    })
    .catch((error) => {console.error("Error:", error)});
}

export function ExploreTab()
{
    const [name, setName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState("");
    const [ingredients, setIngredients] = useState([]);

    function get_recipes()
    {
        get_recipes_impl(name.toLowerCase().trim(), ingredients).then((recipes) => {
            setRecipes(recipes);
            if(recipes.length !== 0)
                setSelected(recipes.at(0).name);
        });
    }

    function get_selected_recipe(name)
    { return recipes.find((recipe) => (recipe.name === name)); }

    return (
        <div id="ExploreTab">
            <div className = "Row">
                <div className = "center">
                    <input
                        className = "RecipeName"
                        type = "text"
                        placeholder = "  Nome"
                        value = {name}
                        onChange = {bind(setName)}
                        onKeyPress = {(event) => {
                            if (event.key === "Enter")
                                get_recipes();
                        }}
                    >
                    </input>
                    <IngredientsTable title = "Ingredientes" ingredients = {ingredients} setIngredients = {setIngredients}/>
                </div>
            </div>
            <div className = "center">
                <button id = "ExploreBtn" onClick = {get_recipes} > &#x1F50D; </button>
            </div>
            <div id = "ExploreResultDiv" className = "center">
                <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {setSelected}/>
                <RecipeDisplay selected = {selected} find_recipe = {get_selected_recipe}/>
            </div>
        </div>
    );
}
