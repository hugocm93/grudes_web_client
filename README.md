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
