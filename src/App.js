import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

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
        </div>
    );
}

function AddIngredientArea()
{
    const [name, setName] = useState("");

    function onChangeCbk(event) {
        setName(event.target.value);
    }

    function add_ingredient()
    {
        console.log(name);
    }

    return (
        <div className="AddIngredientArea">
            <input type = "text" placeholder = "Nome" value = {name} onChange = {onChangeCbk}></input>
            <button className = "Add" onClick={add_ingredient}> Adicionar </button>
        </div>
    );
}

function Ingredients()
{
    return (
        <div className="Ingredients">
            <h1> Ingredientes </h1>
            <AddIngredientArea />
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
