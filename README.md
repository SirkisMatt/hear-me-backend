# hear-me backend

This is HearMe's RESTful api!

## Set up

Complete the following steps to get started:

1. Clone this repository to your local machine `git clone "URL" hear-me-backend`
2. `cd` into the cloned repository
3. Install the node dependencies `npm install`
4. Create an `.env` that will be ignored by git and read by the express server 
5. Edit the `.env` file 
    NODE_ENV=development
    PORT=8000
    DATABASE_URL="postgresql://USERNAME@localhost/DATABASENAME"
    TEST_DATABASE_URL="postgresql://USERNAME@localhost/DATABASENAME_test"
    JWT_SECRET="my-own-special-jwt-secret"
    JWT_EXPIRY="5h"
6. Create a database with DATABASENAME and your USERNAME
7. Run `npm run migrate` to create tables
8. Run `npm run dev` to start nodemon

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Migrations `npm run migrate`

Run the tests `npm test`


## Docs

Protected Endpoints need an Authorization header containing the Bearer token

### Register

api/users/register - (body must contain userName, email, password)

### Login

api/auth/login - (body must include email and password)


### Incident

POST
api/incident - (Request body must contain timeOfIncident, type of incident, and coordinates. An Authorization header containing the Bearer token required)

GET incidents for User
api/incident/user - (retrieve all incidents based on userId and a Authorization header containing the Bearer token)

GET all incidents
api/incident - (retrieve all incidents)

PATCH
api/incident/:incidentId - (Request body must contain timeOfIncident, description, type or coordinates. An Authorization header containing the Bearer token required.)

DELETE
api/incident/:incidentId - (An Authorization header containing the Bearer token required)


