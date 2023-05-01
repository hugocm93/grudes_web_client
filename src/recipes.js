import Table from "./Table";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { to_form_data, bind } from "./utils";
import { ingredient_to_string } from "./ingredients";
import { url } from "./common";

export async function get_recipes_impl(name, ingredients)
{
    var url_ = url + "/recipes";

    url_ = url_ + `?${new URLSearchParams({name: name}).toString()}`;

    ingredients.forEach((ingredient) => {
        if(ingredient.name.length !== 0 )
            url_ = url_ + `&${new URLSearchParams({ingredients: ingredient.name}).toString()}`
    });

    return fetch(url_,
    {
        method: "get",
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.recipes)
        {
            data.recipes.forEach((recipe) => { recipe.id = uuidv4(); });
            return data.recipes;
        }
        else
            return [];
    })
    .catch((error) => {console.error("Error:", error)});
}

export function RecipeDisplay({selected, find_recipe})
{
    const recipe = find_recipe(selected);

    return (
        <div className="RecipeDisplay">
            <div>
                <h1>{recipe ? recipe.name : ""}</h1>
            </div>
            <div className = "Description">
                <label id = "IngredientTitle">Ingredientes:</label>
                <p>{recipe ? recipe.ingredients.map(ingredient_to_string).join("\n") : ""}</p>
            </div>
            <div className = "Description">
                <label>Preparo:</label>
                <p>{recipe ? recipe.instructions : ""}</p>
            </div>
        </div>
    );
}

export function RecipesTab()
{
    return (
        <div id = "RecipesTab">
            <RecipesArea />
        </div>
    );
}

export function RecipesTable({recipes, setRecipes, selectRecipe})
{
    function remove_recipe(id)
    {
        const idx = recipes.findIndex((s) => { return s.id === id; });
        const found = recipes.at(idx);

        if(!window.confirm("Deseja realmente remover a receita " + found.name + "?"))
            return;

        fetch(url + "/recipe" + `?${new URLSearchParams({name: found.name}).toString()}`,
        {
            method: "delete",
        })
        .then((response) => response.json())
        .then((data) => {
            setRecipes(recipes.toSpliced(idx, 1)); 
        })
        .catch((error) => {console.error("Error:", error)});
    }

    const columns = [
        {
            name: "Receitas",
            get: (row) => {
                return (
                    <label> {row.name} </label>
                );
            }
        },
        {
            name: "",
            get: (row) => {
                return (
                    <button className = "RemoveRecipeBtn" onClick = {() => {remove_recipe(row.id)}}> - </button>
                );
            }
        }
    ];

    function table_clicked(event)
    { selectRecipe(event.target.textContent.trim()); }

    return (
        <div className = "RecipesTable">
            <Table columns = {columns} rows = {recipes} onClick = {table_clicked}/>
        </div>
    );
}

function RecipesArea()
{
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState("");
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        get_recipes_impl("", []).then((recipes) => { setRecipes(recipes); });
    }, []);

    async function add_recipe()
    {
        const recipe = {
            name: name,
            instructions: instructions,
            ingredients: ingredients.map((ingredient) => (ingredient.name)),
            quantities: ingredients.map((ingredient) => (ingredient.quantity)),
            units: ingredients.map((ingredient) => (ingredient.unit))
        };

        fetch(url + "/recipe",
        {
            method: "post",
            body: to_form_data(recipe)
        })
        .then((response) => {
            return response.json().then((json) => { return {status: response.status, json: json}; });
        })
        .then((response) => {
            if(response.status !== 200)
            {
                window.alert("Erro: " + response.json.message);
            }
            else
            {
                setName("");
                setIngredients([]);
                setInstructions([]);

                get_recipes_impl("", []).then((recipes) => {setRecipes(recipes); });
            }
        })
        .catch((error) => {console.error("Error:", error)});
    }

    function add_ingredient_item() {
        const newIngredient = {
            name: "ingrediente",
            quantity: 0,
            unit: "xícara",
            id: uuidv4()
        };

        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
    }

    function remove_ingredient(id)
    { setIngredients(ingredients.filter((s) => { return s.id !== id; })); }

    const columns = [
        {
            name: "Ingrediente",
            get: (row) => {
                return (
                    <input
                        type="text"
                        placeholder={"  " + row.name}
                        onChange = {(event) => {row.name = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "Quantidade",
            get: (row) => {
                return (
                    <input
                        id = "Quantity"
                        type = "number"
                        min = {0}
                        placeholder={row.quantity}
                        onChange = {(event) => {row.quantity = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "Unidade",
            get: (row) => {
                return (
                    <input
                        id = "Unit"
                        type = "text"
                        placeholder = {row.unit}
                        onChange = {(event) => {row.unit = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "",
            get: (row) => {
                return (
                    <button className = "RemoveIngredientBtn" onClick = {() => {remove_ingredient(row.id)}}> - </button>
                );
            }
        }
    ];

    function show_recipe(name)
    {
        var recipe;
        get_recipes_impl(name, []).then((recipes) =>
        {
            if(recipes.length !== 0)
                recipe = recipes.at(0);
        }).then(() => {
            if(recipe)
            {
                setName(recipe.name);
                setInstructions(recipe.instructions);

                recipe.ingredients.forEach((ingredient) => {
                    ingredient.name = ingredient.ingredient;
                    ingredient.id = uuidv4();
                });
                setIngredients(recipe.ingredients);
            }
        });
    }

    return (
        <div>
            <div className = "center">
                <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {show_recipe} />
                <input className = "RecipeName" type = "text" placeholder = "  Nome" value = {name} onChange = {bind(setName)}></input>
                <textarea
                    id = "InstructionsTextArea"
                    placeholder = "  Instruções"
                    value = {instructions}
                    onChange = {bind(setInstructions)}>
                </textarea>

                <div id = "AddIngredientsTable">
                    <Table columns = {columns} rows = {ingredients} />
                    <button className = "AddIngredientBtn" onClick = {add_ingredient_item}> + </button>
                </div>
            </div>
            <button className = "Add" onClick={add_recipe}> Cadastrar </button>
        </div>
    );
}
