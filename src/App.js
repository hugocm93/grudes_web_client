import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

let url = "http://127.0.0.1:5001"

function to_form_data(obj)
{
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) =>
    {
        if (Array.isArray(value))
        {
            value.forEach((val) => { formData.append(key, val); });
        } else
        {
            formData.append(key, value);
        }
    });

    return formData;
}

async function get_recipes_impl(name, ingredients, setRecipes)
{
    var url_ = url + "/recipes";

    url_ = url_ + `?${new URLSearchParams({name: name}).toString()}`;

    ingredients.forEach((ingredient) => {
        if(ingredient.name.length !== 0 )
            url_ = url_ + `&${new URLSearchParams({ingredients: ingredient.name}).toString()}`
    });

    console.log(url_);

    return fetch(url_,
    {
        method: "get",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.recipes);
        if(data.recipes)
        {
            data.recipes.forEach((recipe) => { recipe.id = uuidv4(); });
            setRecipes(data.recipes);
        }
        else
            setRecipes([]);
    })
    .catch((error) => {console.error("Error:", error)});
}

function bind(setName) {
    return (event) => { setName(event.target.value); }
}

function Table({ columns, rows, onClick}) {
  return (
    <table onClick = {onClick}>
      <thead>
        <tr key = "1">
        {columns.map((column) => (<th key={column.name} >{column.name}</th>))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (<td key = {column.name}>{column.get(row)}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MenuItem({name, isActive, setActive})
{
    return (
        <button
            className={`MenuItem ${isActive ? 'active' : ''}`}
            onClick={setActive}
        >
        {name}
        </button>
    );
}

function Sidebar({currentIndex, setCurrentIndex})
{
    return (
        <div className="Sidebar">
            <header className="Logo">
                <h1> Grudes </h1>
                <MenuItem
                    name = "Busca"
                    isActive = {currentIndex === 0}
                    setActive = {() => { setCurrentIndex(0); }}
                />
                <MenuItem
                    name = "Receitas"
                    isActive = {currentIndex === 1}
                    setActive = {() => { setCurrentIndex(1); }}
                />
                <MenuItem
                    name = "Ingredientes"
                    isActive = {currentIndex === 2}
                    setActive = {() => { setCurrentIndex(2); }}
                />
            </header>
        </div>
    );
}

function IngredientsTable({title, ingredients, setIngredients})
{
    function add_ingredient_item() {
        const newIngredient = {
            name: "ingrediente",
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
                        placeholder="Nome"
                        onChange = {(event) => {row.name = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "X",
            get: (row) => {
                return (
                    <button className = "RemoveIngredientBtn" onClick = {() => {remove_ingredient(row.id)}}> X </button>
                );
            }
        }
    ];

    return (
        <div className="Row">
            <Table columns = {columns} rows = {ingredients} />
            <button className = "AddIngredientBtn" onClick = {add_ingredient_item}> Adicionar </button>
        </div>
    );
}

function ingredient_to_string(ingredient)
{
    return "" + ingredient.quantity + " " + ingredient.unit + " - " + ingredient.ingredient;
}

function RecipeDisplay({selected, find_recipe})
{
    const recipe = find_recipe(selected);

    return (
        <div className="RecipeDisplay">
            <div>
                <label>Ingredientes:</label>
                {}
                <p>{recipe ? recipe.ingredients.map(ingredient_to_string).join("\n") : ""}</p>
            </div>
            <div>
                <label>Preparo:</label>
                <p>{recipe ? recipe.instructions : ""}</p>
            </div>
        </div>
    );
}

function SearchTab()
{
    const [name, setName] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [selected, setSelected] = useState("");
    const [ingredients, setIngredients] = useState([]);

    function get_recipes()
    { get_recipes_impl(name.toLowerCase().trim(), ingredients, setRecipes); }

    function get_selected_recipe(name)
    { return recipes.find((recipe) => (recipe.name == name)); }

    return (
        <div className="SearchTab">
            <h1> {selected} </h1>
            <div className = "Row">
                <input type = "text" placeholder = "Nome" value = {name} onChange = {bind(setName)}></input>
                <IngredientsTable title = "Ingredientes" ingredients = {ingredients} setIngredients = {setIngredients}/>
                <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {setSelected}/>
                <RecipeDisplay selected = {selected} find_recipe = {get_selected_recipe}/>
            </div>
            <button className = "SearchBtn" onClick = {get_recipes} > Buscar </button>
        </div>
    );
}

function RecipesTab()
{
    return (
        <div className="RecipesTab">
            <h1> Receitas </h1>
            <RecipesArea />
        </div>
    );
}

function IngredientArea()
{
    const [name, setName] = useState("");
    const [substitutes, setSubstitutes] = useState([]);

    function onChangeCbk(event) {
        setName(event.target.value);
    }

    async function save_ingredient()
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

    const columns = [
        {
            name: "Substituto",
            get: (row) => {
                return (
                    <input
                        type="text"
                        placeholder="Nome"
                        onChange = {(event) => {row.name = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "X",
            get: (row) => {
                return (
                    <button className = "RemoveSubstituteBtn" onClick = {() => {remove_substitute(row.id)}}> X </button>
                );
            }
        }
    ];

    return (
        <div className="IngredientArea">
            <div>
                <input type = "text" placeholder = "Nome" value = {name} onChange = {onChangeCbk}></input>
                <IngredientsTable title = "Substitutos" ingredients = {substitutes} setIngredients = {setSubstitutes}/>
            </div>
            <button className = "SaveIngredientBtn" onClick={save_ingredient}> Salvar </button>
        </div>
    );
}

function RecipesTable({recipes, setRecipes, selectRecipe})
{
    function remove_recipe(id)
    {
        const idx = recipes.findIndex((s) => { return s.id === id; });
        const found = recipes.at(idx);

        console.log(found.name);

        if(!window.confirm("Deseja realmente remover a receita " + found.name + "?"))
            return;

        fetch(url + "/recipe" + `?${new URLSearchParams({name: found.name}).toString()}`,
        {
            method: "delete",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setRecipes(recipes.toSpliced(idx, 1)); 
        })
        .catch((error) => {console.error("Error:", error)});
    }

    const columns = [
        {
            name: "Receita",
            get: (row) => {
                return (
                    <label> {row.name} </label>
                );
            }
        },
        {
            name: "X",
            get: (row) => {
                return (
                    <button className = "RemoveRecipeBtn" onClick = {() => {remove_recipe(row.id)}}> X </button>
                );
            }
        }
    ];

    function table_clicked(event)
    { selectRecipe(event.target.textContent.trim()); }

    return (
        <div>
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
        get_recipes_impl("", ingredients, setRecipes);
    }, []);

    function onNameChangeCbk(event) {
        setName(event.target.value);
    }

    function onInstructionsChangeCbk(event) {
        setInstructions(event.target.value);
    }

    async function save_recipe()
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
                get_recipes_impl("", ingredients, setRecipes);

                setName("");
                setIngredients([]);
                setInstructions([]);
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
                        placeholder="Nome"
                        value = {row.name}
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
                        type = "number"
                        min = {0}
                        value = {row.quantity}
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
                        type = "text"
                        placeholder = "xícara"
                        value = {row.unit}
                        onChange = {(event) => {row.unit = event.target.value;}}>
                    </input>
                );
            }
        },
        {
            name: "X",
            get: (row) => {
                return (
                    <button className = "RemoveIngredientBtn" onClick = {() => {remove_ingredient(row.id)}}> X </button>
                );
            }
        }
    ];

    function show_recipe(name)
    {
        var recipe;
        get_recipes_impl(name, [], (recipes) =>
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
                    console.log(ingredient);
                });
                setIngredients(recipe.ingredients);
            }
        });
    }

    return (
        <div>
            <div>
                <div>
                    <RecipesTable recipes = {recipes} setRecipes = {setRecipes} selectRecipe = {show_recipe} />
                </div>
                <div>
                    <input type = "text" placeholder = "Nome" value = {name} onChange = {onNameChangeCbk}></input>
                </div>
                <div>
                    <input type = "text" placeholder = "Instruções" value = {instructions} onChange = {onInstructionsChangeCbk}></input>
                </div>

                <div className = "Row">
                    <Table columns = {columns} rows = {ingredients} />
                    <button className = "AddIngredientBtn" onClick = {add_ingredient_item}> Adicionar </button>
                </div>

            </div>
            <button className = "Save" onClick={save_recipe}> Salvar </button>
        </div>
    );
}

function IngredientsTab()
{
    return (
        <div className="IngredientsTab">
            <h1> Ingredientes </h1>
            <IngredientArea />
        </div>
    );
}

function FormArea({currentIndex})
{
    if(currentIndex === 0)
        return (<SearchTab />);
    else if (currentIndex === 1)
        return (<RecipesTab />);
    else if (currentIndex === 2)
        return (<IngredientsTab />);
}

function App()
{
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="App">
            <Sidebar currentIndex = {currentIndex} setCurrentIndex = {setCurrentIndex}/>
            <FormArea currentIndex = {currentIndex}/>
        </div>
    );
}

export default App;
