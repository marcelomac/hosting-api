## PARA BUILD:

docker compose --env-file .env -f compose.yaml -f compose-dev.yaml up -d --build

## PRODUÇÃO:

docker compose -f compose.yaml up -d

## TAG IMAGE:

docker tag lord-api_nest marceloamac/lord-api_nest

## PUSH DOCKER HUB:

docker push marceloamac/lord-api_nest

## COPIAR ARQUIVO COMPOSE.YAML PARA SERVIDOR REMOTO:

sudo scp ./compose.yaml ti@192.168.4.21:/usr/lord-app

## DOCKER COMPOSE LOGS:

docker compose logs

## EXECUTAR OS CONTAINERES ISOLADAMENTE:

### POSTGRES

docker run -d --name lord_db --network debian_serv_network -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=pgpwd! -e POSTGRES_DB=lord -p 5432:5432 postgres:15.3

### API

docker run -it --rm --name lord_api --network debian_serv_network -p 3001:3001 -e DATABASE_URL=postgres://admin:"pgpwd!"@lord_db:5432/lord marceloamac/lord-api_nest:latest

ou

docker run -d --name lord_api --network debian_serv_network -p 3001:3001 -e DATABASE_URL=postgres://admin:"pgpwd!"@lord_db:5432/lord marceloamac/lord-api_nest:latest
