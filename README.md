# Test-task

## Description

Task has next requirements
    
    1. Write a simple micro-service with CRUD actions to maintain a user-database
    2. Wildcard (partial) search on mail/names & city
    3. It must be written in NodeJS and exposing a REST API on OpenAPI 3.0 specification
    4. The REST API must comply to the Google API Guidelines: https://cloud.google.com/apis/design/
    5. Use a Mongo database and commit the code to GIT
    6. Data model:
        - Email address (required, unique + validated)
        - Password (required, 7 alphanumeric characters and 1 capital letter)
        - First name (required, 25 chars)
        - Last name (required, 25 chars)
        - City (optional, 25 chars)
    7. Automated tests

## How to run

### Pre requirements
MongoDB must be installed locally. By default app try to connect to mongo on port 27017,
but you can change connection string in `config.ts` file in root directory.

If you want run app in docker container you must install docker locally

### Local running
    1. Clone repo to your local machine, navigate to folder with code and run `npm install`
    2. After successfully install packages execute `npm run start` - app by default will start on port '8080', you can change it in config.ts file in root directory

### Docker 
    1. To build docker image execute `npm run docker:build`
    2. After successfully building docker image execute `npm run docker:start`

### Tests

To run tests type `npm run test` in your console

## Swagger