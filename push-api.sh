#!/bin/bash

# Diretório do seu projeto
PROJECT_DIR="/home/marcelo/dev/javascript/meusProjetos/lord-api"

# Mensagem de commit com a data atual no formato 'yyyymmdd'
COMMIT_MESSAGE=$(date +"%Y%m%d")

# Função para verificar erro
check_error() {
    if [ $? -ne 0 ]; then
        echo "Erro no comando anterior. Abortando script."
        exit 1
    fi
}

# Navega para o diretório do projeto
cd $PROJECT_DIR
check_error

# Faz o commit com a mensagem da data atual
git add .
check_error

git commit -m "$COMMIT_MESSAGE"
check_error

# Faz o push para o repositório no GitHub
git push origin main
check_error
