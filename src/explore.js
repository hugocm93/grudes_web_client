import { useState } from "react";
import { bind } from "./utils";
import { IngredientsTable } from "./ingredients";
import { RecipesTable, RecipeDisplay, add_recipe} from "./recipes";
import { numericQuantity } from 'numeric-quantity';

var url = "https://www.themealdb.com/api/json/v1/1/"

function recipe_from_id(id)
{
    var url_ = url + "lookup.php" + `?${new URLSearchParams({i: id}).toString()}`;
    
    return fetch(url_,
    {
        method: "get",
    })
    .then((response) =>
    {
        return response.json();
    })
    .then((data) =>
    {
        return convert_to_recipe(data.meals.at(0));
    })
    .catch((error) =>
    {
        console.error("Error:", error)
    });
}

function convert_to_recipe(meal)
{
    const maxIngredients = 21;
    const ingredients = [];
    for(let i = 1; i < maxIngredients; i++)
    {
        const name = meal["strIngredient" + i];
        if(name !== null && name.length !== 0)
        {
            const measure = meal["strMeasure" + i].split(' ');
            let unit = ""; 
            let quantity = numericQuantity(measure[0]);
            if(isNaN(quantity))
                quantity = 1;
            if(measure.length == 2)
                unit = measure[1];
    
            ingredients.push({ingredient: name, name: name, quantity: quantity, unit: unit});
        }
        else
            break;
    } 

    return {name: meal.strMeal, ingredients: ingredients, instructions: meal.strInstructions};
}

async function get(url, callback)
{
    return fetch(url,
    {
        method: "get",
    })
    .then((response) =>
    {
        return response.json();
    })
    .then((data) =>
    {
        return callback(data);
    })
    .catch((error) =>
    {
        console.error("Error:", error)
        window.alert("Não foram encontrados resultados.");
        return [];
    });
}

async function get_recipes_impl(name, ingredients)
{
    var url_ = ""

    if(name.length !== 0 && ingredients.length == 0)
    {
        url_ = url + "search.php" + `?${new URLSearchParams({s: name}).toString()}`;

        return get(url_, (data) => {
            if(data.meals)
                return data.meals.map(convert_to_recipe);
            else
                return [];
        });
    }
    else if(name.length == 0 && ingredients.length !== 0)
    {
        ingredients.forEach((ingredient) =>
        {
            if(ingredient.hasOwnProperty('name') && (ingredient.name.length !== 0))
                url_ = url + "filter.php"  + `?${new URLSearchParams({i: ingredient.name}).toString()}`;
        });

        return get(url_, (data) => {
            const ids = data.meals.map((meal) => meal.idMeal);
            return Promise.all(ids.map(id => recipe_from_id(id)))
                .catch(error =>
                {
                    console.log(error);
                });
        });
    }
    else
    {
        window.alert("Preencha o nome ou o ingrediente principal.");
        return Promise.resolve([]);
    }
}

export function ExploreTab()
{
    const [name, setName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState("");
    const [ingredients, setIngredients] = useState([]);

    function get_recipes()
    {
        get_recipes_impl(name.trim(), ingredients).then((recipes) => {
            setRecipes(recipes);
            if(recipes.length !== 0)
                setSelected(recipes.at(0).name);
        });
    }

    function get_selected_recipe(name)
    { return recipes.find((recipe) => (recipe.name === name)); }

    function _add_recipe()
    {
        const recipe = get_selected_recipe(selected);
        add_recipe(recipe.name, recipe.instructions, recipe.ingredients)
            .then((response) =>
            {
                if(response.status === 200)
                {
                    setName("");
                    window.alert("Receita inserida com sucesso.");
                }
            });
    }

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
            <div className = "center">
                <div id = "ExploreResultDiv" className = "Row">
                    <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {setSelected}/>
                    <RecipeDisplay selected = {selected} find_recipe = {get_selected_recipe}/>
                </div>
            </div>
            <button className = "Add" onClick={_add_recipe}> Salvar </button>
        </div>
    );
}
