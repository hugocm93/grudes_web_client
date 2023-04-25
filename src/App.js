import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
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

function Table({ columns, rows}) {
  return (
    <table>
      <thead>
        <tr>
        {columns.map((column) => (<th>{column.name}</th>))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (<td>{column.get(row)}</td>))}
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

function Search()
{
    return (
        <div className="Search">
            <h1> Busca </h1>
        </div>
    );
}

function Recipes()
{
    return (
        <div className="Recipes">
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
        .then((response) => response.json())
        .then((data) => {console.log(data)})
        .catch((error) => {console.error("Error:", error)});
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
    { setSubstitutes(substitutes.filter((s) => { console.log(s.name); return s.id !== id; })); }

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
            <input type = "text" placeholder = "Nome" value = {name} onChange = {onChangeCbk}></input>
            <button className = "Save" onClick={save_ingredient}> Salvar </button>
            <button className = "AddSubstituteBtn" onClick = {add_substitute_item}> Adicionar </button>
            <Table columns = {columns} rows = {substitutes} />
        </div>
    );
}

function RecipesArea()
{
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);

    function onNameChangeCbk(event) {
        setName(event.target.value);
    }

    function onInstructionsChangeCbk(event) {
        setInstructions(event.target.value);
    }

    async function save_recipe()
    {
        const recipe = {
            name: name
            //ingredients: ingredients.map(substitute => substitute.name)
        };

        fetch(url + "/recipe",
        {
            method: "post",
            body: to_form_data(recipe)
        })
        .then((response) => response.json())
        .then((data) => {console.log(data)})
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
    { setIngredients(ingredients.filter((s) => { console.log(s.name); return s.id !== id; })); }

    const columns = [
        {
            name: "Ingrediente",
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
            name: "Quantidade",
            get: (row) => {
                return (
                    <input
                        type = "number"
                        min = {0}
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

    return (
        <div className="RecipeArea">
            <input type = "text" placeholder = "Nome" value = {name} onChange = {onNameChangeCbk}></input>
            <input type = "text" placeholder = "Instruções" value = {instructions} onChange = {onInstructionsChangeCbk}></input>
            <button className = "Save" onClick={save_recipe}> Salvar </button>
            <button className = "AddIngredientBtn" onClick = {add_ingredient_item}> Adicionar </button>
            <Table columns = {columns} rows = {ingredients} />
        </div>
    );
}

function Ingredients()
{
    return (
        <div className="Ingredients">
            <h1> Ingredientes </h1>
            <IngredientArea />
        </div>
    );
}

function FormArea({currentIndex})
{
    if(currentIndex === 0)
        return (<Search />);
    else if (currentIndex === 1)
        return (<Recipes />);
    else if (currentIndex === 2)
        return (<Ingredients />);
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
