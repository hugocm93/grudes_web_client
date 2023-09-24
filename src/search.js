import { useState } from "react";
import { bind } from "./utils";
import { IngredientsTable } from "./ingredients";
import { get_recipes_impl, RecipesTable, RecipeDisplay } from "./recipes";

export function SearchTab()
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
        <div id="SearchTab">
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
                <button id = "SearchBtn" onClick = {get_recipes} > &#x1F50D; </button>
            </div>
            <div className = "center">
                <div id = "SearchResultDiv" className = "Row">
                    <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {setSelected}/>
                    <RecipeDisplay selected = {selected} find_recipe = {get_selected_recipe}/>
                </div>
            </div>
        </div>
    );
}
