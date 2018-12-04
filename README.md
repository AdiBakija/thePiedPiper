# The Pied Piper
A basic Express.js server that uses the socket.io library for communicating events to the client.

Clients are able to enter data to a database and query the data by providing key.

## Usage
Fork this repository, then clone your fork of this repository.

```
npm install
npm start
open http://localhost:8080
```
1. Navigate to http://localhost:8080.
2. Provide valid JSON data within 'Data Entry' field to be stored to file.
3. Query stored data by providing a key to the 'Query Data' field.

### Developer Usage
```
npm run local to start with nodemon
npm test to run test suite
npm run lint for linting of code
```


## Final Product
!["The main user interface"](docs/index-page.png)

## Dependencies

* [ExpressJS](http://expressjs.com/)
* [Socket.io](https://socket.io/)

### Developer Dependencies

* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [ESLint](https://eslint.org/)
* [Nodemon](https://nodemon.io/)


