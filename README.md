# Blinkayles

### Introduction

From [Wikipedia](https://en.wikipedia.org/wiki/Kayles)

> Kayles is played with a row of tokens, which represent bowling pins. The row may be of any length. The two players alternate; each player, on his or her turn, may remove either any one pin (a ball bowled directly at that pin), or two adjacent pins (a ball bowled to strike both). Under the normal play convention, a player loses when he or she has no legal move (that is, when all the pins are gone). 

This project exposes a set of RESTful APIs for players to play in tournaments. Each tournament uses single-elimination rule and will eventually generates a winner and a runner-up. To enable support for odd number of participants, the tournaments uses a system called [“bye”](https://en.wikipedia.org/wiki/Bye_(sports)). Multiple tournaments can happen at the same time and all the current games in each tournament can be played separately. 

### Server configuration

##### Https

Due to several privacy considerations, all APIs and websites should enable https to further protect man-in-the-middle attack. This project uses a self-signed certificate to simulate such scenario for testing purposes only. In real world, users should replace this self-signed certificate with the one that issued by a trustworthy certificate authority. 

##### Why include `certs/*`

Generally no one should submit certificates and keys to the VCS of their choice. However, to make testing easier, `cert.pem` and `key.pem` are included in this project. If user do not wish to use these included ones, they have the choice to further configure the server by swapping in their own certificates, or set the correct environmental variables, see following section.

##### Environment variables

When starting a new server, the program will check for several environmental variables for important configurations (however default values are also provided if the variable is not set). 

- `PORT`: which port the server should bind to (listen on), default is 4567;
- `SSL_KEY`: the key file for configuring ssl, default is `certs/key.pem`;
- `SSL_CERT`: the certificate for configuring ssl, default is `certs/cert.pem`.

### API Endpoints

##### `GET /`

Retrieves a welcoming message.

###### Response

Status code: 200 OK

```
{
    hello: "blink"
}
```

##### `POST /tournaments`

Starts a new tournament.

###### Request

`Content-Type: application/json`

```
{
    players: string[]
}
```

###### Response

Status code: 201 CREATED

```json
{
    id: string
}
```

##### `GET /tournaments`

Gets the status of all the tournaments.

###### Response

Status code: 200 OK

```json
[{
    id: string,
    status: {
        time: Date,
        finished: boolean,
        games: [{
            time: Date,
            finished: boolean,
            players: string[],
            currentPlayer: string | undefined,
            row: string,
            winner: string | undefined
        }],
        pastGames: [{
            time: Date,
            finished: boolean,
            players: string[],
            currentPlayer: string | undefined,
            row: string,
            winner: string | undefined
        }],
        players: string[],
        byes: string[],
        championship: [{
            player: string,
            place: 1 | 2
        }] | undefined
    }
}]
```

##### `GET /tournaments/:tournamentId`

Gets the current status of a specific tournament.

###### Response

Status code: 200 OK

```
{
    id: string,
    status: {
        time: Date,
        finished: boolean,
        games: [{
            time: Date,
            finished: boolean,
            players: string[],
            currentPlayer: string | undefined,
            row: string,
            winner: string | undefined
        }],
        pastGames: [{
            time: Date,
            finished: boolean,
            players: string[],
            currentPlayer: string | undefined,
            row: string,
            winner: string | undefined
        }],
        players: string[],
        byes: string[],
        championship: [{
            player: string,
            place: 1 | 2
        }] | undefined
    }
}
```

##### `GET /tournaments/:tournamentId/games/:gameId`

Gets the current status of a specific game in a tournament.

###### Response

Status code: 200 OK

```
{
    time: Date,
    finished: boolean,
    players: string[],
    currentPlayer: string | undefined,
    row: string,
    winner: string | undefined
}
```

##### `POST /tournaments/:tournamentId/games/:gameId/moves`

Makes a move on a specific game in a tournament.

###### Request

`Content-Type: application/json`

```
{
    player: string,
    pins: number[]
}
```

###### Response

Status Code: 200 OK

```
{
    time: Date,
    finished: boolean,
    players: string[],
    currentPlayer: string | undefined,
    row: string,
    winner: string | undefined
}
```

### Dependencies

- `body-parser`: parses request body into json literal object;
- `class-validation`: adds decorators for validating input models;
- `express`: hosts the APIs;
- `inversify`: ioc framework;
- `inversify-express-utils`: a set of utilities for the development of express applications with `Inversify`;
- `reflect-metadata`: polyfill for metadata reflection API;
- `shortid`: generates short non-sequential unique id;

For development only:

- `@types/express`, `@types/mocha`, `@types/shortid`: type definitions for libraries used in the project;
- `mocha`: testing framework;
- `ts-node`: `TypeScript` execution environment for `node`;
- `typescript`: `TypeScript` language support.

### Start the server

In order to start the server, please install required `node` dependencies.

```
$ npm install
```

The project is written in [`TypeScript`](http://www.typescriptlang.org/), so user will need to compile the source code first:

```
$ npm build
```

After build, there will be a `dist` folder that contains all the compiled `JavaScript` files. Simply start the server by running the `index.js`

```
$ node dist/index.js
```

Now that the server has been successfully started, happy kayles-ing :)

Please note: `npm start` can be used to start the server, but it is only for testing purposes only. For best performance, and to avoid any issues, please follow the said way to start the server.

### Batteries included

To eliminate the hassle of all the processes to start the server, and to better manage (orchestrating) the service, the project includes support for `docker-compose`. 

To build the project, simply run:

```
$ docker-compose -f docker-compose.build.yml up
```

After building the project, just run the following command to start the server:

```
$ docker-compose -f docker-compose.yml up
```

Note that in the container’s log, the server reports it is listening on port `80`. This is because the server is listening on port `80` on the container. However, it is being configured to map to the port `4567` on user’s `localhost`. So please use `https://localhost:4567` for the project (unless you have set up the environmental variables to use a different port. 

### Testing

This project uses `mocha` as its testing framework. Every components that contains actual logic has its companion `*.spec.ts` which includes the specifications. To run the tests, simply do:

```
$ npm test
```

After running the tests, `mocha` will generates a report for all the tests it finds in the `src` directory and marks them accordingly.

### Project structure

While all source code resides in `src` directory, there are a few misc. files to support the build and the run of the project. 

- `.vscode/`: a directory contains config files to support `VisualStudio Code` actions;
- `certs/`: a directory contains the self-signed certificate for testing purposes;
- `dist/`: a directory generated by the building process;
- `node_modules`:  a directory contains all the dependencies for the project;
- `src/`: a directory contains all the source code;
- `.editorconfig`: Editorconfig file;
- `.gitignore`: Gitignore file;
- `docker-compose.build.yml`: docker-compose config file for building the project in the container;
- `docker-compose.yml`: docker-compose config file for starting the server in the container;
- `Dockerfile`: docker container config file for building the container;
- `package.json`, `package-lock.json`: npm config file includes project dependencies;
- `README.md`: project README (this file);
- `tsconfig.json`: config files for `TypeScript` compiler `tsc`.

##### Source directory

- `exceptions/`: a directory contains all the exceptions that may be thrown by the program;
- `features/`: a directory contains all the controllers that expose the RESTful APIs, this directory is organized according to the features;
- `helpers/`: a directory contains all the helper functions;
- `middleware/`: a directory contains all the middleware that handle various situations;
- `services/`: a directory contains all the services that supports the APIs;
- `tournament/`: a directory contains the game and tournament logic;
- `index.ts`: server entry point;
- `service-container.ts`: ioc container configuration.