import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

let url = "http://127.0.0.1:5001"

function List({ items, removeCbk }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, index) => (
          <tr key={row.id}>
            <td><input type="text" placeholder="Nome" onChange = {(event) => {row.name = event.target.value;}}></input></td>
            <button className = "RemoveSubstituteBtn" onClick = {() => {removeCbk(row.id)}}> X </button>
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
        </div>
    );
}

function AddIngredientArea()
{
    const [name, setName] = useState("");
    const [substitutes, setSubstitutes] = useState([]);

    function onChangeCbk(event) {
        setName(event.target.value);
    }

    async function save_ingredient()
    {
        const formData = new FormData();
        formData.append("name", name);

        const substitutes = [];
        substitutes.forEach((substitute, index) => {
            formData.append(`substitutes[${index}]`, substitute);
        });

        fetch(url + "/ingredient",
        {
            method: "post",
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {console.log("OK: " + data.name)})
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

    return (
        <div className="AddIngredientArea">
            <input type = "text" placeholder = "Nome" value = {name} onChange = {onChangeCbk}></input>
            <button className = "Save" onClick={save_ingredient}> Salvar </button>
            <button className = "AddSubstituteBtn" onClick = {add_substitute_item}> Adicionar </button>
            <List items = {substitutes} removeCbk = {remove_substitute}/>
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
