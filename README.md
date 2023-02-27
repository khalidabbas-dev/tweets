## Description

A Nest Js application having authentication functionality using passport and tweets cruds with unit tests, stock market tracking with buying and selling of stocks and subscribing to the live rates thorough web sockets.

## Installation

```bash
$ npm install
```

## Running the app

- Create `.env` file in the root directory of the project
- Initialize env variables in `.env` file as depicted in `example.env` file

```bash
# If running first time or after dependencies Installation

$ docker compose up --build

# or

$ docker compose up

```

## Test

```bash
# unit tests

$ npm run test

```

## API's

- POST - auth/login (To login a user)
- POST - auth/register (To register a user)
- POST - users/profile (To get user profile)
- POST - users/:id (To get single user)
- POST - tweets/ (Create a tweet)
- GET - tweets/ (Get all tweets of loggedin user)
- GET - tweets/:id. (Get single tweet)
- PATCH - tweets/:id. (Update tweet)
- DELETE - tweets/:id (Delete a tweet)
- POST - wallets/balance/add (Add balance to user wwallet)
- POST - wallets/shares/buy (To buy new shares)
- POST - wallets/:id (To sell new shares)
- GET - wallets/ (Get user wallet)

## Websocket

- User can subscribe to live rates by connecting to the websocket running on the same server and port as the application server

## License

Nest is [MIT licensed](LICENSE).
