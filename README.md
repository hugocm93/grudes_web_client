# Grudes Web Client

Projeto de avaliação da primeira sprint do curso de Pós-graduação da PUC-Rio em Engenharia de Software.

Esta aplicação utiliza os serviços do [Grudes API](https://github.com/hugocm93/grudes_api). 

---
## Requisitos 
* Sistema Operacional Unix.
* Docker Compose >= 2.5.0 instalado.
* Permissão de execução do docker como superusuário.

---
## Execução
Na raiz deste repositório, executar:
```sh
$ sudo docker compose up --build 
```
Ou para modo desenvolvimento:
```sh
$ sudo docker compose -f docker-compose.yml -f dev.yml up --build 
```
Abra o navegador no endereço http://localhost:3000/ para entrar no site.

---
## Documentação
O site apresenta um menu lateral com 4 itens de Menu: Busca, Receitas, Ingredientes e Explorar.
* Busca: É possível buscar receita por nome ou por ingredientes (ou substitutos). Ao buscar sem informar nome nem ingrediente, todas as receitas são retornadas. Para buscar por nome, basta informar o nome na caixa de texto e apertar o botão de lupa. Para buscar por ingrediente, clicar no botão de + e digitar o nome do ingrediente. A busca é sensível a caixa e busca palavras exatas. Para visualizar uma receita dentre as receitas encontradas, basta clicar em cima do nome dela na lista de receitas. É possível remover a receita diretamente da área de busca, clicando no botão - ao lado da receita.
* Receitas: Área de cadastro de novas receitas e edição de receitas já cadastradas. Para cadastrar uma nova receita, preencher o formulário e clicar no botão cadastrar. Para editar uma receita, selecioná-la na lista, alterar os campos e clicar em Cadastrar.
* Ingredientes: Área de cadastro de ingredientes e ingredientes substitutos. Para cadastrar um novo ingrediente, preencher o formulário e clicar em Cadastrar. Para editar um ingrediente, selecionar um ingrediente da lista, alterar os campos e clicar em Cadastrar.
* Explorar: Área de busca de novas receitas na internet. Nesta área, a busca é efetuada em provedor de receitas. A busca pode ser feita por nome ou por ingrediente principal. Ao encontrar uma receita desejada, é possível salvá-la na sua lista de receitas pessoais clicando no botão Salvar.
