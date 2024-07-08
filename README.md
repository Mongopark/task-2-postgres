# HNG STAGE TWO TASK

A Simple express Js backend service for an app with a Postgres Database, this is a backend service that which every user has an allocated organisation, can create more organisations and can add other users to thir organisations.
It handles authentication using JSON Web Tokens.
Both access tokens and refresh tokens are implemented. Additionally, refresh tokens are stored in a HttpOnly cookie which prevents client-side scripts from accessing it.


## DEV
Rename .sample-env to .env
Create 2 different secret tokens and paste into .env


## Build Setup

``` bash
# install dependencies
npm install

# install global dependencies
npm install -g node
npm install -g ts-node

# serve at localhost:3000
npm run start
or
npm start
```


## USEFUL VSCODE EXTENSIONS
REST Client - humao.rest-client
requests.rest contains example API calls that can be called with the above extension (so no need for POSTMAN ;-( )
