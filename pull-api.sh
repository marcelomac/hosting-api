  GNU nano 7.2                                  upd-app.sh
#!/bin/bash

# Função para verificar erro
check_error() {
    if [ $? -ne 0 ]; then
        echo "Erro no comando anterior. Abortando script."
        exit 1
    fi
}

git pull

npm install
check_error

npm audit fix --force
check_error

npx prisma migrate dev
check_error

npm run build
check_error

pm2 restart all
check_error