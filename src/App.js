import "./App.css";
import Logo from "./logo.png";
import { IngredientsTab } from "./ingredients";
import { RecipesTab } from "./recipes";
import { SearchTab } from "./search";
import { ExploreTab } from "./explore";
import { useState } from "react";

function MenuItem({name, isActive, setActive})
{
    return (
        <button
            className={`MenuItem ${isActive ? "active" : ""}`}
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
            <header id = "Logo" className="Logo">
                <img src={Logo} alt = "Logo"/>
                <h1 id = "MainTitle"> Grudes </h1>
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
                <MenuItem
                    name = "Explorar"
                    isActive = {currentIndex === 3}
                    setActive = {() => { setCurrentIndex(3); }}
                />
            </header>
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
    else if (currentIndex === 3)
        return (<ExploreTab />);
}

function App()
{
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div id = "Background" className="App">
            <Sidebar currentIndex = {currentIndex} setCurrentIndex = {setCurrentIndex}/>
            <FormArea currentIndex = {currentIndex}/>
        </div>
    );
}

export default App;
