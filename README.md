Assignment: CRUD API

To use the app:
1. Install dependencies and devDependencies with `npm install` command.
2. Use `npm run start:dev` to run app in development mode.
   1. dev mode is using nodemon and ts-node to run server from typescript files.
3. Use `npm run start:prod` to run app in production mode.
   1. prod mode is using node to run a server after compiling ts files to js files with typescript compiler.
4. Use `npm test` to run test.
   1. !!! The server need to be offline at the moment of the starting test, because supertest will turn it on automatically.
   2. test scenarions are implemented with `supertest` and `jest`
5. Use `npm run start:multi` to run app using CLUSTER API.
