#!/bin/bash

echo "Instalando..."
npm install

if [ "$1" == "debug" ]; then
	echo "Iniciando debug..."
	npm start 
else
	echo "Iniciando..."
	npm run build 

	#Roda na porta 3000
	npm install -g serve
	serve -s build
fi

