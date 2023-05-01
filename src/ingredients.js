import Table from "./Table";
import { url } from "./common";
import { to_form_data, bind } from "./utils";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function ingredient_to_string(ingredient)
{
    return "" + ingredient.quantity + " " + ingredient.unit + " - " + ingredient.ingredient;
}

async function get_ingredients_impl()
{
    return fetch(url + "/ingredients",
    {
        method: "get",
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.ingredients)
        {
            data.ingredients.forEach((recipe) => { recipe.id = uuidv4(); });
            return data.ingredients;
        }
        else
            return [];
    })
    .catch((error) => {console.error("Error:", error)});
}

export function IngredientsTable({title, ingredients, setIngredients})
{
    function add_ingredient_item() {
        const newIngredient = {
            name: "",
            id: uuidv4()
        };

        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
    }

    function remove_ingredient(id)
    { setIngredients(ingredients.filter((s) => { return s.id !== id; })); }

    const columns = [
        {
            name: title,
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
            name: "",
            get: (row) => {
                return (
                    <button className = "RemoveIngredientBtn" onClick = {() => {remove_ingredient(row.id)}}> - </button>
                );
            }
        }
    ];

    return (
        <div className="IngredientsTable">
            <Table columns = {columns} rows = {ingredients} />
            <button className = "AddIngredientBtn" onClick = {add_ingredient_item}> + </button>
        </div>
    );
}

export function IngredientsArea()
{
    const [name, setName] = useState("");
    const [substitutes, setSubstitutes] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        get_ingredients_impl().then((ingredients) => (setIngredients(ingredients)));
    }, []);

    async function add_ingredient()
    {
        const ingredient = {
            name: name,
            substitutes: substitutes.map(substitute => substitute.name)
        };

        fetch(url + "/ingredient",
        {
            method: "post",
            body: to_form_data(ingredient)
        })
        .then((response) => {
            return response.json().then((json) => { return {status: response.status, json: json}; });
        })
        .then((response) => {
            console.log(response.status);
            if(response.status !== 200)
            {
                console.log(response.json);
                window.alert("Erro: " + response.json.message);
            }
            else
            {
                setName("");
                setSubstitutes([]);
                get_ingredients_impl().then((ingredients) => (setIngredients(ingredients)));
            }
        })
        .catch((error) => {
            console.error("Error:", error)
        });
    }

    function add_substitute_item() {
        const newSubstitute = {
            name: "ingrediente substituto",
            id: uuidv4()
        };

        const newSubstitutes = [...substitutes, newSubstitute];
        setSubstitutes(newSubstitutes);
    }

    function remove_substitute(id)
    { setSubstitutes(substitutes.filter((s) => { return s.id !== id; })); }

    function remove_ingredient(id)
    {
        const idx = ingredients.findIndex((s) => { return s.id === id; });
        const found = ingredients.at(idx);

        if(!window.confirm("Deseja realmente remover o ingrediente " + found.name + "?"))
            return;

        fetch(url + "/ingredient" + `?${new URLSearchParams({name: found.name}).toString()}`,
        {
            method: "delete",
        })
        .then((response) => response.json())
        .then((data) => {
            get_ingredients_impl().then((ingredients) => (setIngredients(ingredients)));
        })
        .catch((error) => {console.error("Error:", error)});
    }

    const columns = [
        {
            name: "Ingredientes",
            get: (row) => { return (<label> {row.name} </label>); }
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

    function show_ingredient(name)
    {
        const ingredient = ingredients.find((ingredient) => (ingredient.name === name));
        if(ingredient)
        {
            setName(ingredient.name);

            setSubstitutes(ingredient.substitutes.map((substitute) => {
                return {name: substitute, id: uuidv4()};
            }));
        }
        else
        {
            setName("");
            setSubstitutes([]);
        }
    }

    function table_clicked(event)
    { show_ingredient(event.target.textContent.trim()); }

    return (
        <div className = "center">
            <div className = "IngredientsTable">
                <Table columns = {columns} rows = {ingredients} onClick = {table_clicked}/>
            </div>
            <div>
                <input className = "IngredientName" type = "text" placeholder = "  Nome" value = {name} onChange = {bind(setName)}></input>
                <IngredientsTable title = "Substitutos" ingredients = {substitutes} setIngredients = {setSubstitutes}/>
            </div>
            <button className = "Add" onClick={add_ingredient}> Cadastrar </button>
        </div>
    );
}

export function IngredientsTab()
{
    return (
        <div id = "IngredientsTab">
            <IngredientsArea />
        </div>
    );
}
