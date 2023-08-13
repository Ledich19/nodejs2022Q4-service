# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.


```bash
# Downloading
git clone {repository URL}

# Installing NPM modules
npm install

# Running application
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/docs/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
# To run only one of all test suites
npm run test -- <path to suite>
# To run all test with authorization
npm run test:auth
# To run only specific test suite with authorization
npm run test:auth -- <path to suite>
```

## Auto-fix and format

```bash
npm run lint

npm run format
```


### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## Docker-Compose
- Docker - [Download & Install Docker](https://www.docker.com/).
- [link to repository](https://hub.docker.com/repository/docker/ledich/nodejs2023q2/general)

```bash
# download image
docker pull ledich/nodejs2023q2:latest  
```
```bash
# check image
npm run scout
```



```bash

# cria e inicia um serviço
docker-compose up

# faz o build das imagens antes de iniciar os containers
docker-compose up --build

#   -d, --detach: detach mode. Run containers in the background;
#   --build: build images before starting containers. garante que o npm install rode novamente, durante o processo de build.
docker-compose up --build -d


# inicia os serviços
docker-compose start

# para os serviços
docker-compose stop

```

Когда вы создаете свой образ, вам не обязательно создавать весь Dockerfile, включая все этапы. Вы можете указать целевую стадию сборки. Следующая команда предполагает, что вы используете предыдущую Dockerfile, но останавливается на этапе с именем builder:

docker build --target builder -t alexellis2/href-counter:latest .